using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RandoX.API.Hubs;
using RandoX.Data.Models.AutionModel;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class AuctionBidController : BaseAPIController
    {
        private readonly IAuctionBidService _bidService;
        private readonly IAccountService _accountService;
        private readonly IHubContext<AuctionHub> _hubContext;
        public AuctionBidController(IAuctionBidService bidService, IAccountService accountService, IHubContext<AuctionHub> hubContext)
        {
            _bidService = bidService;
            _accountService = accountService;
            _hubContext = hubContext;
        }

        [HttpPost("place")]
        public async Task<IActionResult> PlaceBid([FromBody] PlaceBidRequest request)
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");
            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var userId = user.Id; // Lấy từ Claims
            var result = await _bidService.PlaceBidAsync(request.SessionId, userId, request.Amount);
            // ✅ Gửi thông báo SignalR cho tất cả người tham gia phiên này
            await _hubContext.Clients.Group(request.SessionId.ToString())
                .SendAsync("ReceiveNewBid", user.Email, request.Amount);
            return Ok(result);
        }
    }
}
