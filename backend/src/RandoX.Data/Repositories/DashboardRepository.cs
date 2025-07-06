using Microsoft.EntityFrameworkCore;
using RandoX.Data.DBContext;
using RandoX.Data.Interfaces;
using RandoX.Data.Models.DashboardModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly randox_dbContext _context;
        public DashboardRepository(randox_dbContext context)
        {
            _context = context;
        }

        public async Task<RevenueSummary> GetRevenueSummaryAsync()
        {
            var totalRevenue = await _context.Orders.Where(o => o.IsDeleted != true).SumAsync(o => o.TotalAmount);
            var totalOrders = await _context.Orders.CountAsync();
            var totalUsers = await _context.Accounts.CountAsync();
            var totalProductsSold = await _context.CartProducts.SumAsync(cp => cp.Amount);

            return new RevenueSummary
            {
                TotalRevenue = (decimal)totalRevenue,
                TotalOrders = totalOrders,
                TotalUsers = totalUsers,
                TotalProductsSold = (int)totalProductsSold
            };
        }

        public async Task<List<RevenueOverTime>> GetRevenueOverTimeAsync(string range = "month")
        {
            var data = await _context.Orders
                .Where(o => o.IsDeleted != true && o.CreatedAt != null)
                .GroupBy(o => new { o.CreatedAt.Value.Year, o.CreatedAt.Value.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(o => o.TotalAmount)
                })
                .ToListAsync();

            return data.Select(d => new RevenueOverTime
            {
                Period = $"{d.Year}-{d.Month:D2}",
                Revenue = (decimal)d.Revenue
            }).ToList();
        }




        public async Task<List<RevenueByCategory>> GetRevenueByCategoryAsync()
        {
            return await _context.Products
                .Where(p => (bool)!p.IsDeleted)
                .GroupBy(p => p.Category.CategoryName)
                .Select(g => new RevenueByCategory
                {
                    CategoryName = g.Key,
                    Revenue = (decimal)g.Sum(p => p.Quantity * p.Price)
                }).ToListAsync();
        }

        public async Task<List<TopProduct>> GetTopProductsAsync(int limit)
        {
            return await _context.CartProducts
                .Where(p => (bool)!p.IsDeleted)
                .GroupBy(p => p.Product.ProductName)
                .Select(g => new TopProduct
                {
                    ProductName = g.Key,
                    QuantitySold = (int)g.Sum(x => x.Amount),
                    TotalRevenue = (decimal)g.Sum(x => x.Amount * x.Product.Price)
                })
                .OrderByDescending(x => x.TotalRevenue)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<TopUser>> GetTopUsersAsync(int limit)
        {
            return await _context.Orders
                .GroupBy(o => o.Cart.Account.Email)
                .Select(g => new TopUser
                {
                    Email = g.Key,
                    TotalSpent = (decimal)g.Sum(x => x.TotalAmount)
                })
                .OrderByDescending(x => x.TotalSpent)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<RevenueByLocation>> GetRevenueByLocationAsync()
        {
            var data = await _context.Addresses
                .Include(a => a.Account)
                    .ThenInclude(acc => acc.CartAccounts)
                        .ThenInclude(cart => cart.Orders)
                .ToListAsync(); // Chuyển sang client-side để xử lý logic phức tạp

            return data
                .GroupBy(a => a.FullAddress)
                .Select(g => new RevenueByLocation
                {
                    Location = g.Key,
                    Revenue = g.Sum(a =>
                        a.Account?.CartAccounts?
                            .SelectMany(c => c.Orders)?
                            .Sum(o => o.TotalAmount) ?? 0
                    )
                })
                .ToList();
        }


        public async Task<SpinRevenue> GetSpinRevenueAsync()
        {
            var totalSpin = await _context.SpinHistories.CountAsync();
            var totalRevenue = await _context.SpinHistories.SumAsync(s => s.PricePaid);
            return new SpinRevenue
            {
                TotalSpinCount = totalSpin,
                TotalSpinRevenue = totalRevenue
            };
        }
    }
}
