using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RandoX.Data.Interfaces;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Background
{
    public class AutoEndAuctionService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AutoEndAuctionService> _logger;

        public AutoEndAuctionService(IServiceProvider serviceProvider, ILogger<AutoEndAuctionService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var auctionRepo = scope.ServiceProvider.GetRequiredService<IAuctionRepository>();
                var walletRepo = scope.ServiceProvider.GetRequiredService<IWalletRepository>();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                var autoEndService = scope.ServiceProvider.GetRequiredService<IAutoEndService>();
                var hubService = scope.ServiceProvider.GetRequiredService<IAuctionHubService>();

                await autoEndService.HandleSessionExtensionAsync(); // Cộng 5 phút nếu có bid cuối

                var sessions = await auctionRepo.GetUnendedSessionsAsync();
                foreach (var session in sessions)
                {
                    var now = DateTime.Now;
                    var highestBid = session.AuctionBids.OrderByDescending(b => b.Amount).FirstOrDefault();
                    var finalPrice = highestBid?.Amount;

                    // Kết thúc nếu hết thời gian hoặc chạm giá chốt
                    if (session.EndTime <= now ||
                        (session.AuctionItem.ReservePrice != null && finalPrice >= session.AuctionItem.ReservePrice))
                    {
                        session.IsEnded = true;
                        session.FinalPrice = finalPrice;
                        session.EndTime = now;
                        await auctionRepo.UpdateSessionAsync(session);

                        if (highestBid != null)
                        {
                            var winner = await auctionRepo.GetUserByIdAsync(highestBid.UserId);
                            await emailService.SendEmailAsync(winner.Email, "Bạn đã thắng phiên đấu giá",
                                $"<p>Xin chúc mừng! Bạn đã chiến thắng vật phẩm: {session.AuctionItem.Name}</p><p>Giá: {finalPrice:N0}</p>");

                            // Hoàn tiền cho các người thua
                            foreach (var loser in session.AuctionBids.Where(b => b.Id != highestBid.Id))
                            {
                                await walletRepo.AddBalanceAsync(loser.UserId, loser.Amount);
                                var loserUser = await auctionRepo.GetUserByIdAsync(loser.UserId);
                                await emailService.SendEmailAsync(loserUser.Email, "Bạn đã bị vượt giá",
                                    $"<p>Giá bạn đặt đã bị vượt trong phiên đấu giá: {session.AuctionItem.Name}</p>");
                            }
                        }

                        // Gửi thông báo kết thúc đấu giá qua SignalR
                        await hubService.NotifyAuctionEnded(session.Id.ToString());
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}
