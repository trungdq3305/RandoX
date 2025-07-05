using RandoX.Data.Entities;
using RandoX.Data.Models.AutionModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IAuctionItemService
    {
        Task<AuctionItem> SubmitAuctionItemAsync(AuctionItemRequest request, Guid userId);
        Task<bool> ApproveAuctionItemAsync(Guid itemId, DateTime startTime, DateTime endTime);
        Task<bool> RejectAuctionItemAsync(Guid itemId, string reason);

    }


}
