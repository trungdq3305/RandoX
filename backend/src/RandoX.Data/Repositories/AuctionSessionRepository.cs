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
    public class AuctionSessionRepository : IAuctionSessionRepository
    {
        private readonly randox_dbContext _context;

        public AuctionSessionRepository(randox_dbContext context)
        {
            _context = context;
        }


        public async Task<bool> EndSessionAsync(Guid sessionId, decimal finalPrice)
        {
            var session = await _context.AuctionSessions.FindAsync(sessionId);
            if (session == null) return false;

            session.IsEnded = true;
            session.FinalPrice = finalPrice;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ExtendSessionAsync(Guid sessionId, TimeSpan extraTime)
        {
            var session = await _context.AuctionSessions.FindAsync(sessionId);
            if (session == null || session.IsEnded == true) return;

            session.EndTime = session.EndTime?.Add(extraTime);
            await _context.SaveChangesAsync();
        }
        public async Task<AuctionSession> GetByIdAsync(Guid sessionId)
        {
            return await _context.AuctionSessions
                .Include(s => s.AuctionItem)
                .Include(s => s.AuctionBids)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        public async Task UpdateSessionAsync(AuctionSession session)
        {
            _context.AuctionSessions.Update(session);
            await _context.SaveChangesAsync();
        }
        // [1] Lấy tất cả phiên đấu giá chưa kết thúc
        public async Task<List<AuctionSession>> GetUnendedSessionsAsync()
        {
            return await _context.AuctionSessions
                .Where(s => (bool)!s.IsEnded)
                .Include(s => s.AuctionItem)
                .Include(s => s.AuctionBids).ThenInclude(s => s.User)
                .ToListAsync();
        }

        // [2] Lấy tất cả vật phẩm đang chờ duyệt (status = 0)
        public async Task<List<AuctionItem>> GetPendingItemsAsync()
        {
            return await _context.AuctionItems
                .Where(i => i.Status == 0)
                .ToListAsync();
        }

        // [3] Lấy chi tiết phiên đấu giá
        public async Task<AuctionSession?> GetSessionByIdAsync(Guid sessionId)
        {
            return await _context.AuctionSessions
                .Include(s => s.AuctionItem)
                .Include(s => s.AuctionBids)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        // [4] Lấy danh sách tất cả bid theo phiên
        public async Task<List<AuctionBid>> GetBidsBySessionIdAsync(Guid sessionId)
        {
            return await _context.AuctionBids
                .Where(b => b.AuctionSessionId == sessionId)
                .OrderByDescending(b => b.Amount)
                .ToListAsync();
        }
        public async Task<List<AuctionSession>> GetWonAuctionsByUserIdAsync(Guid userId)
        {
            return await _context.AuctionSessions
                .Where(s => s.IsEnded == true &&
                            s.AuctionBids.OrderByDescending(b => b.Amount).FirstOrDefault().UserId == userId)
                .Include(s => s.AuctionItem)
                .Include(s => s.AuctionBids)
                .ToListAsync();
        }

    }

}
