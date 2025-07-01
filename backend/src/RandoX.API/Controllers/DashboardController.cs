using Microsoft.AspNetCore.Mvc;
using RandoX.Service.Interfaces;

namespace RandoX.API.Controllers
{
    public class DashboardController : BaseAPIController
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetRevenueSummary() =>
            Ok(await _dashboardService.GetRevenueSummaryAsync());

        [HttpGet("overtime")]
        public async Task<IActionResult> GetRevenueOverTime([FromQuery] string range = "month") =>
            Ok(await _dashboardService.GetRevenueOverTimeAsync(range));

        [HttpGet("category")]
        public async Task<IActionResult> GetRevenueByCategory() =>
            Ok(await _dashboardService.GetRevenueByCategoryAsync());

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts([FromQuery] int limit = 5) =>
            Ok(await _dashboardService.GetTopProductsAsync(limit));

        [HttpGet("top-users")]
        public async Task<IActionResult> GetTopUsers([FromQuery] int limit = 5) =>
            Ok(await _dashboardService.GetTopUsersAsync(limit));

        [HttpGet("location")]
        public async Task<IActionResult> GetRevenueByLocation() =>
            Ok(await _dashboardService.GetRevenueByLocationAsync());

        [HttpGet("spin-revenue")]
        public async Task<IActionResult> GetSpinRevenue() =>
            Ok(await _dashboardService.GetSpinRevenueAsync());
    }
}
