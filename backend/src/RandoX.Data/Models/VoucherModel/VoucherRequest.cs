using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.VoucherModel
{
    public class VoucherRequest
    {
        public string? VoucherName { get; set; }
        public decimal? VoucherDiscountAmount { get; set; }
        public bool? IsDiscountPercentage { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int? Amount { get; set; }
        public decimal? MinOrderValue { get; set; }
        public decimal? MaxDiscountValue { get; set; }
        public bool? IsActive { get; set; }
    }
}
