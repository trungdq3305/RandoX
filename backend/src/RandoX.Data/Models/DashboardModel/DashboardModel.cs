using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.DashboardModel
{
    public class RevenueSummary
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalUsers { get; set; }
        public int TotalProductsSold { get; set; }
    }

    public class RevenueOverTime
    {
        public string Period { get; set; } // ex: "2025-06"
        public decimal Revenue { get; set; }
    }

    public class RevenueByCategory
    {
        public string CategoryName { get; set; }
        public decimal Revenue { get; set; }
    }

    public class TopProduct
    {
        public string ProductName { get; set; }
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class TopUser
    {
        public string Email { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class RevenueByLocation
    {
        public string Location { get; set; }
        public decimal Revenue { get; set; }
    }

    public class SpinRevenue
    {
        public decimal TotalSpinRevenue { get; set; }
        public int TotalSpinCount { get; set; }
    }
}
