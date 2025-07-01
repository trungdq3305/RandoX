using Microsoft.AspNetCore.Mvc;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class WalletController : BaseAPIController
    {
        private readonly IWalletService _walletService;
        private readonly IAccountService _accountService;
        public WalletController(IWalletService walletService, IAccountService accountService)
        {
            _walletService = walletService;
            _accountService = accountService;
        }
        [HttpPost("deposit-order")]
        public async Task<IActionResult> CreateDepositOrder(decimal totalAmount)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var productResponse = await _walletService.CreateDepositOrderAsync( totalAmount, user.Id.ToString());
            return Ok(productResponse);
        }
        [HttpGet("wallet-history")]
        public async Task<IActionResult> GetWalletHistory(int pageNumber, int pageSize)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var productResponse = await _walletService.GetUserWalletHistorysAsync(pageNumber, pageSize, user.Id.ToString());
            return Ok(productResponse);
        }
        [HttpGet("wallet")]
        public async Task<IActionResult> GetUserWallet()
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);

            var walletResponse = await _walletService.GetUserWalletAsync(user.Id.ToString());

            return Ok(walletResponse);
        }

    }
}
