using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.WalletHistoryModel
{
    public class WalletHistoryDto
    {
        public Guid Id { get; set; }

        public DateOnly TimeTransaction { get; set; }

        public decimal Amount { get; set; }

        public string TransactionTypeName { get; set; }
    }
}
