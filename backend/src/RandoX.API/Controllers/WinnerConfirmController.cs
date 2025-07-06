using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Interfaces;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class WinnerConfirmController : BaseAPIController
    {
        private readonly IAuctionRepository _repo;
        private readonly IEmailService _emailService;
        private readonly IAccountService _accountService;
        public WinnerConfirmController(IAuctionRepository repo, IEmailService emailService, IAccountService accountService)
        {
            _repo = repo;
            _emailService = emailService;
            _accountService = accountService;
        }


        [HttpPost("{sessionId}/shipping")]
        public async Task<IActionResult> ConfirmShipping(Guid sessionId, [FromBody] string address)
        {
            var session = await _repo.GetSessionByIdAsync(sessionId);
            if (session == null || (bool)!session.IsEnded)
                return BadRequest("Phiên chưa kết thúc");

            var bid = await _repo.GetHighestBidAsync(sessionId);

            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");
            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var userId = user.Id; // Lấy từ Claims
            await _repo.SaveShippingInfoAsync(sessionId, userId, address);
            await _emailService.SendEmailAsync(bid.User.Email, "Xác nhận địa chỉ", $"Chúng tôi sẽ gửi đến địa chỉ: {address}");

            return Ok("Xác nhận thành công");
        }


    }
}
