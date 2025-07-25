﻿using Microsoft.EntityFrameworkCore;
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
    public class AccountRepository : Repository<Account>, IAccountRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;

        public AccountRepository(randox_dbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<Account?> GetAccount(string email, string password)
        {
            var user = await Entities.Include(a => a.Role).FirstOrDefaultAsync(u => u.Email == email && u.Status == 1);
            if (user == null)
                return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            return isValid ? user : null;
        }

        public async Task<Account> AddAsync(Account account)
        {
            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();
            return account;
        }
        public async Task<Account> GetByEmailAsync(string email)
        {
            return await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Email == email && a.IsDeleted!= true);
        }

        public async Task<Account> GetByIdAsync(string id)
        {
            return await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Id == Guid.Parse(id) && a.IsDeleted != true);
        }

        public async Task<Account> CreateAsync(Account account)
        {
            account.Id = Guid.NewGuid();
            account.CreatedAt = TimeHelper.GetVietnamTime();
            account.UpdatedAt = TimeHelper.GetVietnamTime();

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<Account> UpdateAsync(Account account)
        {
            account.UpdatedAt = TimeHelper.GetVietnamTime();
            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Accounts
                .AnyAsync(a => a.Email == email && a.IsDeleted != true);
        }

        public async Task<Cart> CreateCartAsync(Cart cart)
        {
            await _context.Carts.AddAsync(cart);
            await _context.SaveChangesAsync();
            return cart;
        }
        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            return await _context.Carts
                .Include(a => a.Account)
                .FirstOrDefaultAsync(a => a.AccountId == Guid.Parse(userId));
        }
        public async Task<List<Account>> GetAllAsync()
        {
            return await _context.Accounts
                .Include(a => a.Role)
                .Where(a => a.IsDeleted != true)
                .ToListAsync();
        }

    }
}
