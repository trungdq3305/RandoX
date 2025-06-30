using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Models.ProductSetModel;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    [Authorize]
    public class ProductSetController : BaseAPIController
    {
        private readonly IProductSetService _productSetService;
        private readonly IAccountService _accountService;
        public ProductSetController(IProductSetService productSetService, IAccountService accountService)
        {
            _productSetService = productSetService;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductSets(int pageNumber, int pageSize)
        {
            var response = await _productSetService.GetAllProductSetsAsync(pageNumber, pageSize);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductSetById(string id)
        {
            var response = await _productSetService.GetProductSetByIdAsync(id);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductSet([FromBody] ProductSetRequest productSetRequest)
        {
            var response = await _productSetService.CreateProductSetAsync(productSetRequest);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProductSet(string id, [FromBody] ProductSetRequest productSetRequest)
        {
            var response = await _productSetService.UpdateProductSetAsync(id, productSetRequest);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductSet(string id)
        {
            var response = await _productSetService.DeleteProductSetAsync(id);
            return Ok(response);
        }
        [HttpPut("promotion")]
        public async Task<IActionResult> UpdatePromotionToProductSet(string id, string proId)
        {
            var response = await _productSetService.UpdateProToProductSetAsync(id, proId);
            return Ok(response);
        }
        [HttpDelete("promotion")]
        public async Task<IActionResult> DeletePromotion(string id)
        {
            var productResponse = await _productSetService.DeletePromotionAsync(id);
            return Ok(productResponse);
        }

        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddSettoCart(string setId, int amount)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);

            var productResponse = await _productSetService.AddSetToCartAsync(user.Id.ToString(), setId, amount);
            return Ok(productResponse);
        }
    }
}
