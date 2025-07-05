using Microsoft.AspNetCore.SignalR;
using RandoX.API.Hubs;
using RandoX.Service.Interfaces;

namespace RandoX.API.Services
{
    public class AuctionHubService : IAuctionHubService
    {
        private readonly IHubContext<AuctionHub> _hubContext;

        public AuctionHubService(IHubContext<AuctionHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyNewBid(string sessionId, decimal amount)
        {
            await _hubContext.Clients.Group(sessionId).SendAsync("ReceiveBid", amount);
        }

        public async Task NotifyAuctionEnded(string sessionId)
        {
            await _hubContext.Clients.Group(sessionId).SendAsync("AuctionEnded");
        }
    }
}
