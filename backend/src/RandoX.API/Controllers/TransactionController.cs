using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandoX.Common;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Service.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace RandoX.API.Controllers
{
    [Authorize]
    public class TransactionController : BaseAPIController
    {
        private readonly IPayOSService _payOSService;
        private readonly randox_dbContext _dbContext;
        private readonly ILogger<TransactionController> _logger;
        private readonly IAccountService _accountService;
        private readonly ITransactionService _transactionService;

        public TransactionController(
            IPayOSService payOSService,
            randox_dbContext dbContext,
            ILogger<TransactionController> logger,
            IAccountService accountService,
            ITransactionService transactionService)
        {
            _payOSService = payOSService;
            _dbContext = dbContext;
            _logger = logger;
            _accountService = accountService;
            _transactionService = transactionService;
        }

        [HttpPost("payos/create")]
        public async Task<IActionResult> CreatePayOSPayment([FromQuery] CreatePaymentRequest request)
        {
            try
            {
                // Lấy thông tin order
                var order = await _dbContext.Orders
                    .Include(o => o.Cart)
                    .FirstOrDefaultAsync(o => o.Id == Guid.Parse(request.OrderId));

                if (order == null)
                {
                    return NotFound(new { Message = "Không tìm thấy đơn hàng" });
                }

                // Tính tổng tiền (bao gồm shipping cost nếu có)
                decimal totalAmount = (order.TotalAmount ?? 0) + (order.ShippingCost ?? 0);

                if (totalAmount <= 0)
                {
                    return BadRequest(new { Message = "Số tiền thanh toán không hợp lệ" });
                }

                // Tạo request cho PayOS
                var payOSRequest = new PayOSCreatePaymentRequest
                {
                    OrderId = order.Id.ToString(),
                    Amount = 3000,
                    Description = $"Thanh toan don hang {order.Id}",
                    ReturnUrl = "https://randoxfe.vercel.app/payment-success",
                    CancelUrl = "https://randoxfe.vercel.app/payment-cancel"
                };

                // Gọi service tạo link thanh toán
                var result = await _payOSService.CreatePaymentAsync(payOSRequest);

                if (result.Success)
                {
                    return Ok(new
                    {
                        Success = true,
                        CheckoutUrl = result.CheckoutUrl,
                        PaymentLinkId = result.PaymentLinkId,
                        OrderId = order.Id,
                        Amount = totalAmount,
                        Message = "Tạo link thanh toán PayOS thành công"
                    });
                }

                return BadRequest(new { Success = false, Message = result.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo thanh toán PayOS cho Order: {OrderId}", request.OrderId);
                return StatusCode(500, new { Message = "Có lỗi xảy ra khi tạo thanh toán" });
            }
        }
        [HttpPost("payment-success")]
        public async Task<IActionResult> PaymentSuccess([FromQuery] PayOSReturnQuery query)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized(new { code = "401", desc = "Bạn chưa đăng nhập" });

            var email = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);
            if (user == null)
                return Unauthorized(new { code = "401", desc = "Không tìm thấy người dùng" });

            var result = await _payOSService.HandleReturnUrlAsync(query, user.Id);

            if (!result.Success && !result.AlreadyProcessed)
                return BadRequest(new
                {
                    code = "20",
                    desc = result.Message,
                    orderCode = result.OrderCode
                });

            // 200 OK cho cả success & already processed (idempotent)
            return Ok(new
            {
                code = "00",
                desc = result.AlreadyProcessed ? "Giao dịch đã được xử lý trước đó" : "success",
                success = result.Success,
                alreadyProcessed = result.AlreadyProcessed,
                orderCode = result.OrderCode,
                transactionId = result.TransactionId
            });
        }


        [HttpGet]
        public async Task<IActionResult> GetTransactionHistory()
        {
            var identity = this.HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return Unauthorized("Bạn chưa đăng nhập");

            var claims = identity.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var user = await _accountService.GetAccountByEmailAsync(email);

            if (user == null)
            {
                return NotFound(new { Message = "Không tìm thấy người dùng" });
            }

            var transactions = await _transactionService.GetUserTransactionAsync(user.Id);

            if (transactions != null)
            {
                return Ok(transactions);
            }

            return Ok(new List<Transaction>());
        }

        
    }

    public class CreatePaymentRequest
    {
        [Required]
        public string OrderId { get; set; }
    }
}