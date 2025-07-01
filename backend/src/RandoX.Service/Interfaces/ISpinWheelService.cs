using RandoX.Data.Models.SpinModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface ISpinWheelService
    {
        Task<SpinResultDto> SpinAsync(Guid accountId, Guid wheelId);
        Task<SpinWheelDetailDto> GetWheelDetailAsync(Guid wheelId);
        Task<List<SpinWheelSummaryDto>> GetAllWheelsAsync();

    }

}
