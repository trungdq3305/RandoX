using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Models.AutionModel;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class AuctionItemController : BaseAPIController
    {
        private readonly IAuctionItemService _service;
        private readonly IAccountService _accountService;

        public AuctionItemController(IAuctionItemService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] AuctionItemRequest request)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var userId = user.Id; // Lấy từ Claims
            var item = await _service.SubmitAuctionItemAsync(request, userId);
            return Ok(item);
        }
        [HttpPost("{itemId}/approve")]
        public async Task<IActionResult> Approve(Guid itemId, [FromQuery] int durationMinutes = 30)
        {
            var start = DateTime.Now;
            var end = start.AddMinutes(durationMinutes);

            var success = await _service.ApproveAuctionItemAsync(itemId, start, end);
            return success ? Ok("Đã duyệt vật phẩm") : BadRequest("Duyệt thất bại");
        }

        [HttpPost("{itemId}/reject")]
        public async Task<IActionResult> Reject(Guid itemId, [FromBody] string reason)
        {
            var success = await _service.RejectAuctionItemAsync(itemId, reason);
            return success ? Ok("Đã từ chối vật phẩm") : BadRequest("Từ chối thất bại");
        }

    }

}
