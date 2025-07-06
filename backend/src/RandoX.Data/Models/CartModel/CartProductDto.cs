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
    }
}
