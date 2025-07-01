using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.SpinModel
{
    public class SpinWheelDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; } // 'voucher' or 'product'
        public List<SpinRewardItemDto> Items { get; set; }
    }

    public class SpinRewardItemDto
    {
        public string RewardName { get; set; }
        public decimal RewardValue { get; set; }
        public double Probability { get; set; }
        public string RewardType { get; set; } // 'voucher' or 'product'
    }

}
