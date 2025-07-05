using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IAuctionRepository
    {
        // Auction Item
        Task<AuctionItem> CreateItemAsync(AuctionItem item);
        Task<AuctionItem?> GetItemByIdAsync(Guid itemId);
        Task<IEnumerable<AuctionItem>> GetPendingItemsAsync();
        Task UpdateItemAsync(AuctionItem item);
        Task<bool> ApproveItemAsync(Guid itemId, DateTime startTime, DateTime endTime);
        Task<bool> RejectItemAsync(Guid itemId, string reason);

        // Auction Session
        Task<AuctionSession> GetSessionByIdAsync(Guid id);

        // Bids
        Task<AuctionBid> GetHighestBidAsync(Guid sessionId);
        Task SaveShippingInfoAsync(Guid sessionId, Guid userId, string address);
        Task<AuctionShippingInfo?> GetShippingInfoAsync(Guid sessionId);
        Task<List<AuctionSession>> GetUnendedSessionsAsync();
        Task UpdateSessionAsync(AuctionSession session);
        Task<Account> GetUserByIdAsync(Guid userId);
    }

}
