using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Models;
using RandoX.Data.Models.WalletHistoryModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IWalletService
    {
        Task<ApiResponse<Order>> CreateDepositOrderAsync(decimal totalAmount, string cartId);
        Task<ApiResponse<PaginationResult<WalletHistoryDto>>> GetUserWalletHistorysAsync(int pageNumber, int pageSize, string accountId);
        Task<ApiResponse<WalletDto>> GetUserWalletAsync(string accountId);
        Task WithdrawAsync(Guid accountId, decimal amount, string description);
    }
}
