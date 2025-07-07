using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.AutionModel
{
    public class AuctionItemRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public string Condition { get; set; }
        public decimal StartPrice { get; set; }
        public decimal StepPrice { get; set; }
        public decimal ReservePrice { get; set; }
    }


    public class PlaceBidRequest
    {
        public Guid SessionId { get; set; }
        public decimal Amount { get; set; }
    }


}
