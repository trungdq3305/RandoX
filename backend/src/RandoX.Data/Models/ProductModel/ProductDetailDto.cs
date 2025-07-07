using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.ProductModel
{
    public class ProductDetailDto
    {
        public Guid Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int? Quantity { get; set; }
        public decimal Price { get; set; }

        public string? ManufacturerName { get; set; }
        public string? CategoryName { get; set; }

        public string? PromotionEvent { get; set; }
        public double? PercentageDiscountValue { get; set; }
        public decimal? DiscountValue { get; set; }

        public string? ImageUrl { get; set; }
        public Guid? ProductSetId { get; set; }
    }

}
