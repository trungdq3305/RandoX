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
    public class TransactionRepository : Repository<Transaction>, ITransactionRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;
        public TransactionRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            Entities.Add(transaction);
            await _uow.SaveChangesAsync();
            return transaction;
        }
        public async Task<List<Transaction>> GetUserTransactionAsync(Guid userid)
        {
            var a = await _context.Orders.Where(x => x.CartId == userid).ToListAsync();
            var b = new List<Transaction>();
            foreach (var item in a)
            {
                var transaction = await _context.Transactions
    .Where(x => x.TransactionStatusId.ToString() == "B7165764-E3D5-41D8-A265-E6AC2414FD28" && x.Id == item.Id)
    .Select(x => new Transaction
    {
        Id = x.Id,
        PaymentTypeId = x.PaymentTypeId,
        PaymentLocation = x.PaymentLocation,
        PayDate = x.PayDate,
        Amount = x.Amount,
        Description = x.Description,
        TransactionStatusId = x.TransactionStatusId,
        WalletHistoryId = x.WalletHistoryId,
        CreatedAt = x.CreatedAt,
        TransactionStatus = new TransactionStatus
        {
            Id = (Guid)x.TransactionStatusId,
            TransactionStatusName = x.TransactionStatus.TransactionStatusName
        }
    })
    .FirstOrDefaultAsync();

                if (transaction != null)
                {
                    b.Add(transaction);
                }
            }
            return b;
        }

    }
}
