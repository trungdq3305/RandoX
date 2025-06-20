using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.VoucherModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly IVoucherRepository _voucherRepository;

        public VoucherService(IVoucherRepository voucherRepository)
        {
            _voucherRepository = voucherRepository;
        }

        public async Task<ApiResponse<PaginationResult<Voucher>>> GetAllVouchersAsync(int pageNumber, int pageSize)
        {
            try
            {
                var vouchers = await _voucherRepository.GetAllVouchersAsync();
                var paginatedResult = new PaginationResult<Voucher>(vouchers.ToList(), vouchers.Count(), pageNumber, pageSize);

                return ApiResponse<PaginationResult<Voucher>>.Success(paginatedResult, "success");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<Voucher>>.Failure("Fail to get vouchers");
            }
        }

        public async Task<ApiResponse<Voucher>> GetVoucherByIdAsync(string id)
        {
            try
            {
                var voucher = await _voucherRepository.GetVoucherByIdAsync(id);
                return ApiResponse<Voucher>.Success(voucher, "success");
            }
            catch (Exception)
            {
                return ApiResponse<Voucher>.Failure("Fail to get voucher");
            }
        }

        public async Task<ApiResponse<Voucher>> CreateVoucherAsync(VoucherRequest voucherRequest)
        {
            try
            {
                Voucher voucher = new Voucher
                {
                    Id = Guid.NewGuid(),
                    VoucherName = voucherRequest.VoucherName,
                    VoucherDiscountAmount = voucherRequest.VoucherDiscountAmount,
                    IsDiscountPercentage = voucherRequest.IsDiscountPercentage,
                    StartDate = voucherRequest.StartDate,
                    EndDate = voucherRequest.EndDate,
                    Amount = voucherRequest.Amount,
                    MinOrderValue = voucherRequest.MinOrderValue,
                    MaxDiscountValue = voucherRequest.MaxDiscountValue,
                    IsActive = voucherRequest.IsActive
                };

                await _voucherRepository.CreateVoucherAsync(voucher);

                return ApiResponse<Voucher>.Success(voucher, "Voucher created successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Voucher>.Failure("Fail to create voucher");
            }
        }

        public async Task<ApiResponse<Voucher>> UpdateVoucherAsync(string id, VoucherRequest voucherRequest)
        {
            try
            {
                var voucher = await _voucherRepository.GetVoucherByIdAsync(id);
                if (voucher == null)
                {
                    return ApiResponse<Voucher>.Failure("Voucher not found");
                }

                voucher.VoucherName = voucherRequest.VoucherName;
                voucher.VoucherDiscountAmount = voucherRequest.VoucherDiscountAmount;
                voucher.IsDiscountPercentage = voucherRequest.IsDiscountPercentage;
                voucher.StartDate = voucherRequest.StartDate;
                voucher.EndDate = voucherRequest.EndDate;
                voucher.Amount = voucherRequest.Amount;
                voucher.MinOrderValue = voucherRequest.MinOrderValue;
                voucher.MaxDiscountValue = voucherRequest.MaxDiscountValue;
                voucher.IsActive = voucherRequest.IsActive;

                await _voucherRepository.UpdateVoucherAsync(voucher);

                return ApiResponse<Voucher>.Success(voucher, "Voucher updated successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Voucher>.Failure("Fail to update voucher");
            }
        }

        public async Task<ApiResponse<Voucher>> DeleteVoucherAsync(string id)
        {
            try
            {
                var voucher = await _voucherRepository.GetVoucherByIdAsync(id);
                if (voucher == null)
                {
                    return ApiResponse<Voucher>.Failure("Voucher not found");
                }

                voucher.DeletedAt = DateTime.UtcNow;
                voucher.IsDeleted = true;
                await _voucherRepository.UpdateVoucherAsync(voucher);

                return ApiResponse<Voucher>.Success(voucher, "Voucher deleted successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Voucher>.Failure("Fail to delete voucher");
            }
        }
    }
}
