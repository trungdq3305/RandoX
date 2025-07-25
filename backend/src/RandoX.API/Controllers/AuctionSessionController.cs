﻿using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Interfaces;
using RandoX.Service.Interfaces;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    public class AuctionSessionController : BaseAPIController
    {
        private readonly IAuctionSessionRepository _repo;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IWalletRepository _walletRepo;
        private readonly IAccountService _accountService;
        public AuctionSessionController(IAuctionSessionRepository repo, IAuctionRepository auctionRepository, IWalletRepository walletRepo, IAccountService accountService)
        {
            _repo = repo;
            _auctionRepository = auctionRepository;
            _walletRepo = walletRepo;
            _accountService = accountService;
        }
        [HttpGet]
        public async Task<IActionResult> GetSessions()
        {
            var sessions = await _repo.GetSessionsAsync();
            return Ok(sessions);
        }
        // [1] Xem tất cả phiên đang diễn ra
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveSessions()
        {
            var sessions = await _repo.GetUnendedSessionsAsync();
            return Ok(sessions);
        }

        // [2] Xem tất cả vật phẩm cần duyệt (chưa được duyệt)
        [HttpGet("pending-items")]
        public async Task<IActionResult> GetPendingItems()
        {
            var items = await _repo.GetPendingItemsAsync();
            return Ok(items);
        }

        // [3] Xem chi tiết một phiên đấu giá (kèm danh sách bid)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionDetail(Guid id)
        {
            var session = await _repo.GetSessionByIdAsync(id);
            if (session == null) return NotFound("Không tìm thấy phiên");

            var bids = await _repo.GetBidsBySessionIdAsync(id);
            return Ok(new { session, bids });
        }

        [HttpGet("won")]
        public async Task<IActionResult> GetWonAuctions()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");
            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            var userId = user.Id; // Lấy từ Claims

            var wonAuctions = await _repo.GetWonAuctionsByUserIdAsync(userId);
            return Ok(wonAuctions);
        }
        [HttpGet("{sessionId}/shipping-info")]
        public async Task<IActionResult> GetShippingInfo(Guid sessionId)
        {
            var info = await _auctionRepository.GetShippingInfoAsync(sessionId);
            if (info == null) return NotFound("Chưa có xác nhận");

            return Ok(new
            {
                info.Address,
                info.ConfirmedAt,
                info.User.Email
            });
        }
        [HttpPost("{sessionId}/complete")]
        public async Task<IActionResult> ConfirmDeliveryComplete(Guid sessionId)
        {
            var session = await _repo.GetSessionByIdAsync(sessionId);
            if (session == null || (bool)!session.IsEnded)
                return BadRequest("Phiên chưa kết thúc");

            if (session.FinalPrice == null || session.AuctionItem == null)
                return BadRequest("Không có giá cuối hoặc vật phẩm");

            var sellerId = session.AuctionItem.UserId;
            await _walletRepo.AddBalanceAsync(sellerId, session.FinalPrice.Value);
            return Ok("Đã chuyển tiền cho người bán");
        }

    }
}
