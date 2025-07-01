using Microsoft.EntityFrameworkCore;
using RandoX.Data.Bases;
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
    public class WalletRepository : Repository<WalletHistory>, IWalletRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;

        public WalletRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }
        public async Task<IEnumerable<WalletHistory>> GetAllUserWalletHistorysAsync(Guid accountId)
        {
            return await Entities.Include(x => x.TransactionType).Where(a => a.IsDeleted != true && a.AccountId == accountId).ToListAsync();
        }
        public async Task<Wallet> GetUserWalletAsync(Guid accountId)
        {
            return await _context.Wallets.FirstOrDefaultAsync(a => a.IsDeleted != true && a.Id == accountId);
        }
        public async Task<Wallet> UpdateWalletAsync(Wallet wallet)
        {
            _context.Wallets.Update(wallet);
            await _uow.SaveChangesAsync();
            return wallet;
        }
        public async Task<WalletHistory> CreateWalletHistoryAsync(WalletHistory walletHistory)
        {
            Entities.Add(walletHistory);
            await _uow.SaveChangesAsync();
            return walletHistory;
        }
        public async Task<Wallet> CreateWalletAsync(Wallet wallet)
        {
            _context.Wallets.Add(wallet);
            await _uow.SaveChangesAsync();
            return wallet;
        }

    }
}
