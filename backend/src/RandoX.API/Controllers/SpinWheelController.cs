using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    
    public class SpinWheelController : BaseAPIController
    {
        private readonly ISpinWheelService _service;
        private readonly IAccountService _accountService;

        public SpinWheelController(ISpinWheelService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpPost("spin/{wheelId}")]
        [Authorize]
        public async Task<IActionResult> Spin(Guid wheelId)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email); // implement từ token hoặc session
            var result = await _service.SpinAsync(user.Id, wheelId);
            return Ok(result);
        }

        [HttpGet("{wheelId}")]
        public async Task<IActionResult> GetWheelDetail(Guid wheelId)
        {
            var result = await _service.GetWheelDetailAsync(wheelId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWheels()
        {
            var result = await _service.GetAllWheelsAsync();
            return Ok(result);
        }

        [HttpGet("history/me")]
        [Authorize]
        public async Task<IActionResult> GetMySpinHistory()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var email = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var result = await _service.GetHistoryByAccountIdAsync(user.Id);
            return Ok(result);
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetAllSpinHistories()
        {
            var result = await _service.GetAllHistoryAsync();
            return Ok(result);
        }


    }
}
