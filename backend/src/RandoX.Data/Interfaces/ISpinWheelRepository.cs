using RandoX.Data.Entities;
using RandoX.Data.Models.SpinModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface ISpinWheelRepository
    {
        Task<SpinWheel> GetWheelWithItems(Guid wheelId);
        Task DeductRewardQuantity(SpinItem item);
        Task SaveSpinHistory(Guid accountId, SpinWheel wheel, SpinItem item);
        Task<SpinWheelDetailDto> GetWheelDetailAsync(Guid wheelId);
        Task<List<SpinWheelSummaryDto>> GetAllWheelsAsync();

    }

}
