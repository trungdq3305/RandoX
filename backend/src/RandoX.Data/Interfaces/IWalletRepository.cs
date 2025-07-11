﻿using Microsoft.EntityFrameworkCore;
using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IWalletRepository
    {
        Task<IEnumerable<WalletHistory>> GetAllUserWalletHistorysAsync(Guid accountId);
        Task<WalletHistory> CreateWalletHistoryAsync(WalletHistory walletHistory);
        Task<Wallet> CreateWalletAsync(Wallet wallet);
        Task<Wallet> UpdateWalletAsync(Wallet wallet);
        Task<Wallet> GetUserWalletAsync(Guid accountId);
        Task<Wallet> GetByUserIdAsync(Guid userId);
        Task<bool> DeductBalanceAsync(Guid userId, decimal amount);
        Task AddBalanceAsync(Guid userId, decimal amount);
    }
}
