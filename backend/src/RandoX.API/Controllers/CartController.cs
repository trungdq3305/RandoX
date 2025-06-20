using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Models.Category;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class CartController : BaseAPIController
    {
        private readonly ICartService _cartService;
        private readonly IAccountService _accountService;

        public CartController(ICartService cartService, IAccountService accountService)
        {
            _cartService = cartService;
            _accountService = accountService;
        }
        [HttpPut("cartproduct-amount")]
        public async Task<IActionResult> UpdateCartproductAmount(string id, int amount)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var response = await _cartService.UpdateCartProductAmountAsync(id, amount, user.Id.ToString());
            return Ok(response);
        }
        [HttpGet]
        public async Task<IActionResult> GetCart(int pageNumber, int pageSize)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);

            var response = await _cartService.GetAllInCartAsync(pageNumber, pageSize, user.Id.ToString());
            return Ok(response);
        }
    }
}
