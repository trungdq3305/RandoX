using RandoX.Data.Interfaces;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class AutoEndService : IAutoEndService
    {
        private readonly IAuctionRepository _auctionRepo;

        public AutoEndService(IAuctionRepository auctionRepo)
        {
            _auctionRepo = auctionRepo;
        }

        public async Task HandleSessionExtensionAsync()
        {
            var sessions = await _auctionRepo.GetUnendedSessionsAsync();
            foreach (var session in sessions)
            {
                var lastBid = session.AuctionBids.OrderByDescending(b => b.CreatedAt).FirstOrDefault();
                if ((session.EndTime.GetValueOrDefault() - lastBid.CreatedAt.GetValueOrDefault()).TotalMinutes <= 5)

                {
                    session.EndTime = session.EndTime.GetValueOrDefault().AddMinutes(5);

                    await _auctionRepo.UpdateSessionAsync(session);
                    await _hubService.NotifyTimeExtended(session.Id.ToString(), session.EndTime.Value);
                }
            }
        }
    }
}
