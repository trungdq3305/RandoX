using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.SpinModel
{
    public class SpinHistoryDto
    {
        public string WheelName { get; set; }
        public string RewardName { get; set; }
        public string RewardType { get; set; } // 'product' or 'voucher'
        public decimal RewardValue { get; set; }
        public decimal PricePaid { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string UserEmail { get; set; } // chỉ dùng cho admin
    }

}
