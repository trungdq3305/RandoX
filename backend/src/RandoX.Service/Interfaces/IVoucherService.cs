using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Models;
using RandoX.Data.Models.VoucherModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IVoucherService
    {
        Task<ApiResponse<PaginationResult<Voucher>>> GetAllVouchersAsync(int pageNumber, int pageSize);
        Task<ApiResponse<Voucher>> GetVoucherByIdAsync(string id);
        Task<ApiResponse<Voucher>> CreateVoucherAsync(VoucherRequest voucherRequest);
        Task<ApiResponse<Voucher>> UpdateVoucherAsync(string id, VoucherRequest voucherRequest);
        Task<ApiResponse<Voucher>> DeleteVoucherAsync(string id);
    }
}
