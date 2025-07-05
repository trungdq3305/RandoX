using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IAuctionBidRepository
    {
        Task<AuctionSession> GetSessionByIdAsync(Guid sessionId);
        Task<AuctionBid> GetHighestBidAsync(Guid sessionId);
        Task<bool> CreateBidAsync(AuctionBid bid);
    }

}
