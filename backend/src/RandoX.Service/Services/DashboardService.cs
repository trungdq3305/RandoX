using RandoX.Data.Interfaces;
using RandoX.Data.Models.DashboardModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public Task<RevenueSummary> GetRevenueSummaryAsync() => _dashboardRepository.GetRevenueSummaryAsync();
        public Task<List<RevenueOverTime>> GetRevenueOverTimeAsync(string range) => _dashboardRepository.GetRevenueOverTimeAsync(range);
        public Task<List<RevenueByCategory>> GetRevenueByCategoryAsync() => _dashboardRepository.GetRevenueByCategoryAsync();
        public Task<List<TopProduct>> GetTopProductsAsync(int limit) => _dashboardRepository.GetTopProductsAsync(limit);
        public Task<List<TopUser>> GetTopUsersAsync(int limit) => _dashboardRepository.GetTopUsersAsync(limit);
        public Task<List<RevenueByLocation>> GetRevenueByLocationAsync() => _dashboardRepository.GetRevenueByLocationAsync();
        public Task<SpinRevenue> GetSpinRevenueAsync() => _dashboardRepository.GetSpinRevenueAsync();
    }
}
