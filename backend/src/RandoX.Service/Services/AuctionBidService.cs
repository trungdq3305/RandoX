using Microsoft.AspNetCore.SignalR;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class AuctionBidService : IAuctionBidService
    {
        private readonly IAuctionBidRepository _bidRepo;
        private readonly IAuctionSessionRepository _sessionRepo;
        private readonly IWalletRepository _walletRepo;
        private readonly IEmailService _emailService;
        private readonly IAccountRepository _accountRepo;
        private readonly IAuctionHubService _hubService;
        public AuctionBidService(IAuctionBidRepository bidRepo,
                                 IAuctionSessionRepository sessionRepo,
                                 IWalletRepository walletRepo,
                                 IEmailService emailService,
                                 IAccountRepository accountRepo,
                                 IAuctionHubService hubService)
        {
            _bidRepo = bidRepo;
            _sessionRepo = sessionRepo;
            _walletRepo = walletRepo;
            _emailService = emailService;
            _accountRepo = accountRepo;
            _hubService = hubService;
        }

        public async Task<ApiResponse<string>> PlaceBidAsync(Guid sessionId, Guid userId, decimal amount)
        {
            var session = await _sessionRepo.GetByIdAsync(sessionId);
            if (session == null || session.IsEnded == true || session.EndTime < DateTime.Now)
                return ApiResponse<string>.Failure("Phiên không hợp lệ");

            var current = await _bidRepo.GetHighestBidAsync(sessionId);
            decimal currentPrice = current?.Amount ?? session.AuctionItem.StartPrice ?? 0;
            decimal step = session.AuctionItem.StepPrice ?? 1;

            if (amount < currentPrice + step)
                return ApiResponse<string>.Failure("Giá đấu không hợp lệ");

            var wallet = await _walletRepo.GetByUserIdAsync(userId);
            if (wallet == null || wallet.Balance < amount)
                return ApiResponse<string>.Failure("Không đủ tiền trong ví");

            // hoàn tiền người cũ nếu có
            if (current != null)
            {
                await _walletRepo.AddBalanceAsync(current.UserId, current.Amount);
                var prevUser = await _accountRepo.GetByIdAsync(current.UserId.ToString());
                var itemName = session.AuctionItem.Name;
                var link = $"https://randox.vn/auction/item/{session.AuctionItem.Id}";
                await _emailService.SendEmailAsync(prevUser.Email, "Bạn đã bị vượt giá", $@"<p>Bạn đã bị vượt giá trong phiên <strong>{itemName}</strong>.</p><p><a href='{link}'>Xem chi tiết</a></p>");
            }

            // trừ tiền người mới
            await _walletRepo.DeductBalanceAsync(userId, amount);

            // tạo bid mới
            var bid = new AuctionBid
            {
                Id = Guid.NewGuid(),
                AuctionSessionId = sessionId,
                UserId = userId,
                Amount = amount,
                CreatedAt = DateTime.Now
            };

            await _bidRepo.CreateBidAsync(bid);
            await _hubService.NotifyNewBid(sessionId.ToString(), amount);

            // nếu chạm giá chốt
            if (session.AuctionItem.ReservePrice != null && amount >= session.AuctionItem.ReservePrice)
            {
                session.IsEnded = true;
                session.FinalPrice = amount;
                session.EndTime = DateTime.Now;
                await _sessionRepo.UpdateSessionAsync(session);
            }

            return ApiResponse<string>.Success("Đặt giá thành công");
        }
    }
}
