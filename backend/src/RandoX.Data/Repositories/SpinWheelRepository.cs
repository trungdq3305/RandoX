using Microsoft.EntityFrameworkCore;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models.SpinModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Repositories
{
    public class SpinWheelRepository : ISpinWheelRepository
    {
        private readonly randox_dbContext _context;

        public SpinWheelRepository(randox_dbContext context)
        {
            _context = context;
        }

        public async Task<SpinWheel> GetWheelWithItems(Guid wheelId)
        {
            return await _context.SpinWheels
                .Include(w => w.SpinItems)
                .FirstOrDefaultAsync(w => w.Id == wheelId);
        }

        public async Task DeductRewardQuantity(SpinItem item)
        {
            if (item.RewardType == "product" && item.ProductId.HasValue)
            {
                var product = await _context.Products.FindAsync(item.ProductId.Value);
                if (product == null || product.QuantityForSpin <= 0)
                    throw new Exception("Sản phẩm không đủ để quay");

                product.QuantityForSpin -= 1;
            }
            else if (item.RewardType == "voucher" && item.VoucherId.HasValue)
            {
                var voucher = await _context.Vouchers.FindAsync(item.VoucherId.Value);
                if (voucher == null || voucher.AmountForSpin <= 0)
                    throw new Exception("Voucher không đủ để quay");

                voucher.AmountForSpin -= 1;
            }
            else
            {
                throw new Exception("Không xác định được loại phần thưởng");
            }

            await _context.SaveChangesAsync();
        }

        public async Task SaveSpinHistory(Guid accountId, SpinWheel wheel, SpinItem item)
        {
            var history = new SpinHistory
            {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                SpinWheelId = wheel.Id,
                SpinItemId = item.Id,
                PricePaid = wheel.Price,
                RewardValue = item.RewardValue,
                CreatedAt = TimeHelper.GetVietnamTime()
            };
            await _context.SpinHistories.AddAsync(history);
            await _context.SaveChangesAsync();
        }
        public async Task<SpinWheelDetailDto> GetWheelDetailAsync(Guid wheelId)
        {
            var wheel = await _context.SpinWheels
                .Include(w => w.SpinItems)
                .FirstOrDefaultAsync(w => w.Id == wheelId);

            if (wheel == null)
                throw new Exception("Vòng quay không tồn tại");

            var items = wheel.SpinItems.Select(i => new SpinRewardItemDto
            {
                RewardName = i.RewardName,
                RewardValue = i.RewardValue,
                Probability = (double)i.Probability,
                RewardType = i.RewardType
            }).ToList();

            return new SpinWheelDetailDto
            {
                Id = wheel.Id,
                Name = wheel.Name,
                Price = wheel.Price,
                Type = wheel.Type,
                Items = items
            };
        }
        public async Task<List<SpinWheelSummaryDto>> GetAllWheelsAsync()
        {
            return await _context.SpinWheels
                .Where(w => w.IsActive == true)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new SpinWheelSummaryDto
                {
                    Id = w.Id,
                    Name = w.Name,
                    Price = w.Price,
                    Type = w.Type,
                })
                .ToListAsync();
        }
        public async Task<List<SpinHistoryDto>> GetHistoryByAccountIdAsync(Guid accountId)
        {
            return await _context.SpinHistories
                .Where(h => h.AccountId == accountId)
                .Include(h => h.SpinItem)
                .Include(h => h.SpinWheel)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new SpinHistoryDto
                {
                    WheelName = h.SpinWheel.Name,
                    RewardName = h.SpinItem.RewardName,
                    RewardType = h.SpinItem.RewardType,
                    RewardValue = h.RewardValue,
                    PricePaid = h.PricePaid,
                    CreatedAt = h.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<SpinHistoryDto>> GetAllHistoryAsync()
        {
            return await _context.SpinHistories
                .Include(h => h.SpinItem)
                .Include(h => h.SpinWheel)
                .Include(h => h.Account)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new SpinHistoryDto
                {
                    WheelName = h.SpinWheel.Name,
                    RewardName = h.SpinItem.RewardName,
                    RewardType = h.SpinItem.RewardType,
                    RewardValue = h.RewardValue,
                    PricePaid = h.PricePaid,
                    CreatedAt = h.CreatedAt,
                    UserEmail = h.Account.Email
                })
                .ToListAsync();
        }

    }

}
