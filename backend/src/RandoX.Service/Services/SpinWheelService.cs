using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models.SpinModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class SpinWheelService : ISpinWheelService
    {
        private readonly ISpinWheelRepository _repo;
        private readonly IWalletService _walletService;

        public SpinWheelService(ISpinWheelRepository spinWheelRepository, IWalletService walletService)
        {
            _repo = spinWheelRepository;
            _walletService = walletService;
        }
        public async Task<SpinResultDto> SpinAsync(Guid accountId, Guid wheelId)
        {
            var wheel = await _repo.GetWheelWithItems(wheelId);
            

            if (wheel.Price > 0)
            {
                await _walletService.WithdrawAsync(accountId, wheel.Price, "Quay sản phẩm");
            }

            var item = SelectRandomItem((List<SpinItem>)wheel.SpinItems);
            if (item == null) throw new Exception("Không còn phần thưởng");

            await _repo.DeductRewardQuantity(item);
            await _repo.SaveSpinHistory(accountId, wheel, item);

            return new SpinResultDto
            {
                RewardName = item.RewardName,
                RewardType = item.RewardType,
                RewardValue = item.RewardValue
            };
        }

        private SpinItem SelectRandomItem(List<SpinItem> items)
        {
            var total = items.Sum(x => x.Probability);
            var rand = new Random().NextDouble() * (double)total;
            double cumulative = 0;
            foreach (var item in items)
            {
                cumulative += (double)item.Probability;
                if (rand <= cumulative) return item;
            }
            return null;
        }
        public async Task<SpinWheelDetailDto> GetWheelDetailAsync(Guid wheelId)
        {
            return await _repo.GetWheelDetailAsync(wheelId);
        }
        public async Task<List<SpinWheelSummaryDto>> GetAllWheelsAsync()
        {
            return await _repo.GetAllWheelsAsync();
        }
    }

}
