using Microsoft.EntityFrameworkCore;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Repositories
{

    public class AuctionRepository : IAuctionRepository
    {
        private readonly randox_dbContext _context;

        public AuctionRepository(randox_dbContext context)
        {
            _context = context;
        }

        public async Task<AuctionItem> CreateItemAsync(AuctionItem item)
        {
            _context.AuctionItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<AuctionItem?> GetItemByIdAsync(Guid itemId)
        {
            return await _context.AuctionItems
                .Include(ai => ai.User)
                .FirstOrDefaultAsync(ai => ai.Id == itemId );
        }

        public async Task<IEnumerable<AuctionItem>> GetPendingItemsAsync()
        {
            return await _context.AuctionItems
                .Where(ai => ai.Status == 0 )
                .OrderByDescending(ai => ai.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateItemAsync(AuctionItem item)
        {
            _context.AuctionItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task<AuctionSession> CreateSessionAsync(AuctionSession session)
        {
            _context.AuctionSessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<Account?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Id == userId && a.IsDeleted != true);
        }
        public async Task<bool> ApproveItemAsync(Guid itemId, DateTime startTime, DateTime endTime)
        {
            var item = await _context.AuctionItems.FirstOrDefaultAsync(x => x.Id == itemId);
            if (item == null || item.Status != 0) return false;

            item.Status = 1;
            item.UpdatedAt = DateTime.Now;

            var session = new AuctionSession
            {
                Id = Guid.NewGuid(),
                AuctionItemId = itemId,
                StartTime = startTime,
                EndTime = endTime,
                IsEnded = false,
                CreatedAt = DateTime.Now
            };

            _context.AuctionItems.Update(item);
            _context.AuctionSessions.Add(session);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectItemAsync(Guid itemId, string reason)
        {
            var item = await _context.AuctionItems.FirstOrDefaultAsync(x => x.Id == itemId);
            if (item == null || item.Status != 0) return false;

            item.Status = 2;
            item.StaffNote = reason;
            item.UpdatedAt = DateTime.Now;

            _context.AuctionItems.Update(item);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<AuctionBid> GetHighestBidAsync(Guid sessionId)
        {
            return await _context.AuctionBids
                .Where(b => b.AuctionSessionId == sessionId)
                .OrderByDescending(b => b.Amount)
                .FirstOrDefaultAsync();
        }

        public async Task<AuctionSession> GetSessionByIdAsync(Guid id)
        {
            return await _context.AuctionSessions.Include(a => a.AuctionItem).Include(a => a.AuctionBids)
                .FirstOrDefaultAsync(ai => ai.Id == id);
        }
        public async Task SaveShippingInfoAsync(Guid sessionId, Guid userId, string address)
        {
            var info = new AuctionShippingInfo
            {
                AuctionSessionId = sessionId,
                UserId = userId,
                Address = address,
                ConfirmedAt = DateTime.Now
            };
            _context.AuctionShippingInfos.Add(info);
            await _context.SaveChangesAsync();
        }

        public async Task<AuctionShippingInfo?> GetShippingInfoAsync(Guid sessionId)
        {
            return await _context.AuctionShippingInfos
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.AuctionSessionId == sessionId);
        }
        public async Task<List<AuctionSession>> GetUnendedSessionsAsync()
        {
            return await _context.AuctionSessions
                .Include(s => s.AuctionItem)
                .Include(s => s.AuctionBids)
                .Where(s => s.IsEnded == false && s.EndTime > DateTime.Now)
                .ToListAsync();
        }

        public async Task UpdateSessionAsync(AuctionSession session)
        {
            _context.AuctionSessions.Update(session);
            await _context.SaveChangesAsync();
        }

        

    }
}
