using RandoX.Data.Models.DashboardModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IDashboardRepository
    {
        Task<RevenueSummary> GetRevenueSummaryAsync();
        Task<List<RevenueOverTime>> GetRevenueOverTimeAsync(string range);
        Task<List<RevenueByCategory>> GetRevenueByCategoryAsync();
        Task<List<TopProduct>> GetTopProductsAsync(int limit);
        Task<List<TopUser>> GetTopUsersAsync(int limit);
        Task<List<RevenueByLocation>> GetRevenueByLocationAsync();
        Task<SpinRevenue> GetSpinRevenueAsync();
    }

}
