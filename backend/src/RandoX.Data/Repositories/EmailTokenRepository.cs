using Microsoft.EntityFrameworkCore;
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
    public class EmailTokenRepository : IEmailTokenRepository
    {
        private readonly randox_dbContext _context;

        public EmailTokenRepository(randox_dbContext context)
        {
            _context = context;
        }

        public async Task<EmailToken> CreateTokenAsync(EmailToken token)
        {
            token.Id = Guid.NewGuid();
            token.CreatedAt = TimeHelper.GetVietnamTime();

            _context.EmailTokens.Add(token);
            await _context.SaveChangesAsync();
            return token;
        }

        public async Task<EmailToken> GetTokenAsync(string token, string tokenType)
        {
            return await _context.EmailTokens
                .Include(t => t.Account)
                .Where(t => t.TokenType == tokenType &&
                            t.IsUsed != true &&
                            t.ExpiryDate > TimeHelper.GetVietnamTime())
                .OrderByDescending(t => t.CreatedAt) // Lấy token mới nhất
                .FirstOrDefaultAsync(t => t.Token == token);
        }


        public async Task<EmailToken> UpdateTokenAsync(EmailToken token)
        {
            _context.EmailTokens.Update(token);
            await _context.SaveChangesAsync();
            return token;
        }

        public async Task<bool> ValidateTokenAsync(string token, string email, string tokenType)
        {
            var tokenEntity = await _context.EmailTokens
                .Include(t => t.Account)
                .Where(t => t.Account.Email == email &&
                            t.TokenType == tokenType &&
                            t.IsUsed != true &&
                            t.ExpiryDate > TimeHelper.GetVietnamTime())
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();

            return tokenEntity != null && tokenEntity.Token == token;
        }

    }
}
