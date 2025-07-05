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
    public class AuctionBidRepository : IAuctionBidRepository
    {
        private readonly randox_dbContext _context;

        public AuctionBidRepository(randox_dbContext context)
        {
            _context = context;
        }

        public async Task<AuctionSession> GetSessionByIdAsync(Guid sessionId)
        {
            return await _context.AuctionSessions
                .Include(s => s.AuctionItem)
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        public async Task<AuctionBid> GetHighestBidAsync(Guid sessionId)
        {
            return await _context.AuctionBids
                .Where(b => b.AuctionSessionId == sessionId)
                .OrderByDescending(b => b.Amount)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> CreateBidAsync(AuctionBid bid)
        {
            _context.AuctionBids.Add(bid);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
