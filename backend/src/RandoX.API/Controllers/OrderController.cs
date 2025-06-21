using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Models.ProductModel;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class OrderController : BaseAPIController
    {
        private readonly IOrderService _orderService;
        private readonly IAccountService _accountService;
        public OrderController(IOrderService orderService, IAccountService accountService)
        {
            _orderService = orderService;
            _accountService = accountService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateProduct(decimal shippingCost, string voucherId)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var productResponse = await _orderService.CreateOrderAsync(user.Id.ToString(), shippingCost, voucherId);
            return Ok(productResponse);
        }
    }
}
