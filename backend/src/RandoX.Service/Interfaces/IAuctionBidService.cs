using RandoX.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IAuctionBidService
    {
        Task<ApiResponse<string>> PlaceBidAsync(Guid sessionId, Guid userId, decimal amount);
    }
}
