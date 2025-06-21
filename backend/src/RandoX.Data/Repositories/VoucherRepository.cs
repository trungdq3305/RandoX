
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

    public class VoucherRepository : Repository<Voucher>, IVoucherRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;

        public VoucherRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }

        public async Task<IEnumerable<Voucher>> GetAllVouchersAsync()
        {
            return await Entities.Where(a => a.IsDeleted != true).ToListAsync();
        }

        public async Task<Voucher> GetVoucherByIdAsync(string id)
        {
            return await Entities.Where(a => a.IsDeleted != true).FirstOrDefaultAsync(v => v.Id == Guid.Parse(id));
        }

        public async Task<Voucher> CreateVoucherAsync(Voucher voucher)
        {
            Entities.Add(voucher);
            await _uow.SaveChangesAsync();
            return voucher;
        }

        public async Task<Voucher> UpdateVoucherAsync(Voucher voucher)
        {
            Entities.Update(voucher);
            await _uow.SaveChangesAsync();
            return voucher;
        }
    }
}
