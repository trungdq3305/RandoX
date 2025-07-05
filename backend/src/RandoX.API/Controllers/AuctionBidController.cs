using Microsoft.AspNetCore.Mvc;
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

        public AuctionBidController(IAuctionBidService bidService, IAccountService accountService)
        {
            _bidService = bidService;
            _accountService = accountService;
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
            return Ok(result);
        }
    }
}
