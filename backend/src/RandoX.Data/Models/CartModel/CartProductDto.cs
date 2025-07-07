using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.CartModel
{
    public class CartProductDto
    {
        public Guid Id { get; set; }
        public int? Amount { get; set; }
        public string? ProductName { get; set; }
        public string? ProductSetName { get; set; }
        public decimal? Price { get; set; } // 👈 Giá gốc
        public int? PercentageDiscountValue { get; set; } // 👈 Phần trăm giảm
        public decimal? DiscountValue { get; set; } // 👈 Giá sau giảm
        public string? ImageUrl { get; set; }
    }
}
