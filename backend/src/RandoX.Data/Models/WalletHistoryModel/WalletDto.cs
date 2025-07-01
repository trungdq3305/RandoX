using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.WalletHistoryModel
{
    public class WalletDto
    {
        public Guid Id { get; set; }
        public decimal Balance { get; set; }
    }
}
