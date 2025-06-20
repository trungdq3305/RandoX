using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Models.VoucherModel;
using RandoX.Service.Interfaces;

namespace RandoX.API.Controllers
{
    [Authorize]
    public class VoucherController : BaseAPIController
    {
        private readonly IVoucherService _voucherService;

        public VoucherController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVouchers(int pageNumber, int pageSize)
        {
            var response = await _voucherService.GetAllVouchersAsync(pageNumber, pageSize);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucherById(string id)
        {
            var response = await _voucherService.GetVoucherByIdAsync(id);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVoucher([FromBody] VoucherRequest voucherRequest)
        {
            var response = await _voucherService.CreateVoucherAsync(voucherRequest);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVoucher(string id, [FromBody] VoucherRequest voucherRequest)
        {
            var response = await _voucherService.UpdateVoucherAsync(id, voucherRequest);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoucher(string id)
        {
            var response = await _voucherService.DeleteVoucherAsync(id);
            return Ok(response);
        }
    }
}
