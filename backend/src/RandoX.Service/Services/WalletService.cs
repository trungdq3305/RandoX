using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;

using RandoX.Data.Models.VoucherModel;
using RandoX.Data.Models.WalletHistoryModel;
using RandoX.Data.Repositories;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _walletRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IAccountRepository _accountRepository;

        public WalletService(IWalletRepository walletRepository,IOrderRepository orderRepository, IAccountRepository accountRepository)
        {
            _walletRepository = walletRepository;
            _orderRepository = orderRepository;
            _accountRepository = accountRepository;
        }

        public async Task<ApiResponse<Order>> CreateDepositOrderAsync(decimal totalAmount, string cartId)
        {
            try
            {
               Order order = new Order
                {
                    Id = Guid.NewGuid(),
                    CartId = Guid.Parse(cartId),
                    TotalAmount = totalAmount,
                    IsDeposit = true,
                };

                await _orderRepository.CreateOrderAsync(order);

                return ApiResponse<Order>.Success(order, "Deposit order created successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Order>.Failure("Fail to create Deposit order");
            }
        }
        public async Task<ApiResponse<PaginationResult<WalletHistoryDto>>> GetUserWalletHistorysAsync(int pageNumber, int pageSize, string accountId)
        {
            try
            {
                var his = await _walletRepository.GetAllUserWalletHistorysAsync(Guid.Parse(accountId));

                // Project sang DTO
                var dtoList = his
                    .Select(h => new WalletHistoryDto
                    {
                        Id = h.Id,
                        TimeTransaction = h.TimeTransaction,
                        Amount = h.Amount,
                        TransactionTypeName = h.TransactionType?.TransactionTypeName 
                    })
                    .ToList();

                var paginatedResult = new PaginationResult<WalletHistoryDto>(dtoList, dtoList.Count, pageNumber, pageSize);

                return ApiResponse<PaginationResult<WalletHistoryDto>>.Success(paginatedResult, "success");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<WalletHistoryDto>>.Failure("Fail to get WalletHistory");
            }
        }
        public async Task<ApiResponse<WalletDto>> GetUserWalletAsync(string accountId)
        {
            try
            {
                Guid accountGuid = Guid.Parse(accountId);

                var histories = await _walletRepository.GetAllUserWalletHistorysAsync(accountGuid);
                decimal totalBalance = histories
                    .Where(h => h.IsDeleted != true)
                    .Sum(h => h.Amount);

                var wallet = await _walletRepository.GetUserWalletAsync(accountGuid);

                
                    wallet.Balance = totalBalance;
                    wallet.UpdatedAt = DateTime.Now;

                    wallet = await _walletRepository.UpdateWalletAsync(wallet);
                

                var result = new WalletDto
                {
                    Id = wallet.Id,
                    Balance = wallet.Balance
                };

                return ApiResponse<WalletDto>.Success(result, "Lấy ví thành công và đã cập nhật số dư.");
            }
            catch (Exception)
            {
                return ApiResponse<WalletDto>.Failure("Lỗi khi lấy và cập nhật số dư ví.");
            }
        }


    }
}
