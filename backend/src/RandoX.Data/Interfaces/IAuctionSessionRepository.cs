using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IAuctionSessionRepository
    {
        Task<AuctionSession> GetSessionByIdAsync(Guid sessionId);
        Task<bool> EndSessionAsync(Guid sessionId, decimal finalPrice);
        Task ExtendSessionAsync(Guid sessionId, TimeSpan extraTime);
        Task<AuctionSession> GetByIdAsync(Guid sessionId);
        Task UpdateSessionAsync(AuctionSession session);
        Task<List<AuctionSession>> GetUnendedSessionsAsync();
        Task<List<AuctionItem>> GetPendingItemsAsync();
        Task<List<AuctionBid>> GetBidsBySessionIdAsync(Guid sessionId);
        Task<List<AuctionSession>> GetWonAuctionsByUserIdAsync(Guid userId);

    }

}
