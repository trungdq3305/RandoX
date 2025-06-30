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
        public Guid? ProductId { get; set; }
        public Guid? CartId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool? IsDeleted { get; set; }
        public int? Amount { get; set; }
        public Guid? ProductSetId { get; set; }
    }
}
