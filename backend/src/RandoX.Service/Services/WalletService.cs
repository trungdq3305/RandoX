using Microsoft.EntityFrameworkCore;
using RandoX.Common;
using RandoX.Data;
using RandoX.Data.DBContext;
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
        private readonly randox_dbContext _context;
        public WalletService(IWalletRepository walletRepository,IOrderRepository orderRepository, IAccountRepository accountRepository, randox_dbContext randox_DbContext)
        {
            _walletRepository = walletRepository;
            _orderRepository = orderRepository;
            _accountRepository = accountRepository;
            _context = randox_DbContext;
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
                    wallet.UpdatedAt = TimeHelper.GetVietnamTime();

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
        public async Task WithdrawAsync(Guid accountId, decimal amount, string description)
        {
            var wallet = await _context.Wallets.FindAsync(accountId);
            if (wallet == null)
                throw new Exception("Ví không tồn tại");

            if (wallet.Balance < amount)
                throw new Exception("Số dư không đủ");

            wallet.Balance -= amount;

            // Ghi wallet_history
            var history = new WalletHistory
            {
                Id = Guid.NewGuid(),
                TimeTransaction = DateOnly.FromDateTime(TimeHelper.GetVietnamTime()),
                Amount = -amount,
                AccountId = accountId,
                TransactionTypeId = await GetTransactionTypeId("Payment"), // hoặc Cache
                CreatedAt = TimeHelper.GetVietnamTime()
            };
            await _context.WalletHistories.AddAsync(history);

            

            await _context.SaveChangesAsync();
        }

        private async Task<Guid> GetTransactionTypeId(string typeName)
        {
            return await _context.TransactionTypes
                .Where(x => x.TransactionTypeName == typeName)
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        private async Task<Guid> GetTransactionStatusId(string status)
        {
            return await _context.TransactionStatuses
                .Where(x => x.TransactionStatusName == status)
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

    }
}
