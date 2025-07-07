using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.ProductSetModel
{
    public class ProductSetDetailDto
    {
        public Guid Id { get; set; }
        public string ProductSetName { get; set; }
        public string Description { get; set; }
        public int? SetQuantity { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }

        public string? PromotionEvent { get; set; }
        public double? PercentageDiscountValue { get; set; }
        public decimal? DiscountValue { get; set; }

        public string? ProductName { get; set; }
        public string? ImageUrl { get; set; } // 👈 Thêm dòng này

    }
}
