using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RandoX.Data;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace RandoX.Common
{
    // 1. PayOS Configuration Model
    public class PayOSConfig
    {
        public string ClientId { get; set; }
        public string ApiKey { get; set; }
        public string ChecksumKey { get; set; }
        public string PaymentUrl { get; set; } = "https://api-merchant.payos.vn/v2/payment-requests";
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }

    // 2. Request/Response Models (app-level)
    public class PayOSCreatePaymentRequest
    {
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
        public string? BuyerPhone { get; set; }
        public string? BuyerAddress { get; set; }
        public int? ExpiredAfterMinutes { get; set; } = 15;
    }

    public class PayOSCreatePaymentResponse
    {
        public string CheckoutUrl { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string PaymentLinkId { get; set; }
    }

    // PayOS API Request/Response Models
    public class PayOSPaymentRequest
    {
        public long orderCode { get; set; }
        public int amount { get; set; }
        public string description { get; set; }
        public string buyerName { get; set; }
        public string buyerEmail { get; set; }
        public string buyerPhone { get; set; }
        public string buyerAddress { get; set; }
        public List<PayOSItem> items { get; set; }
        public string cancelUrl { get; set; }
        public string returnUrl { get; set; }
        public int? expiredAt { get; set; }
        public string signature { get; set; }
    }

    public class PayOSItem
    {
        public string name { get; set; }
        public int quantity { get; set; }
        public int price { get; set; }
    }

    public class PayOSApiResponse
    {
        public string code { get; set; }
        public string desc { get; set; }
        public PayOSResponseData data { get; set; }
    }

    public class PayOSResponseData
    {
        public string bin { get; set; }
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public int amount { get; set; }
        public string description { get; set; }
        public long orderCode { get; set; }
        public string currency { get; set; }
        public string paymentLinkId { get; set; }
        public string status { get; set; }
        public string checkoutUrl { get; set; }
        public string qrCode { get; set; }
    }

    public class PayOSCallbackRequest
    {
        public string code { get; set; }
        public string desc { get; set; }
        public bool success { get; set; }
        public PayOSCallbackData data { get; set; }
        public string signature { get; set; }
    }
    public class PayOSReturnQuery
    {
        public string code { get; set; }          // "00" nếu thành công
        public string id { get; set; }            // paymentLinkId
        public bool cancel { get; set; }          // false nếu không bị hủy
        public string status { get; set; }        // "PAID" nếu đã thanh toán
        public long orderCode { get; set; }       // orderCode bạn đã tạo
    }


    public class PayOSCallbackData
    {
        public long orderCode { get; set; }
        public int amount { get; set; }
        public string description { get; set; }
        public string accountNumber { get; set; }
        public string reference { get; set; }
        public string transactionDateTime { get; set; }
        public string currency { get; set; }
        public string paymentLinkId { get; set; }
        public string code { get; set; }
        public string desc { get; set; }
        public string counterAccountBankId { get; set; }
        public string counterAccountBankName { get; set; }
        public string counterAccountName { get; set; }
        public string counterAccountNumber { get; set; }
        public string virtualAccountName { get; set; }
        public string virtualAccountNumber { get; set; }
    }
    public sealed class PayOSReturnHandleResult
    {
        public bool Success { get; init; }
        public string Message { get; init; }
        public long OrderCode { get; init; }
        public Guid? TransactionId { get; init; }
        public bool AlreadyProcessed { get; init; }
    }

    // 3. Service Interface
    public interface IPayOSService
    {
        Task<PayOSCreatePaymentResponse> CreatePaymentAsync(PayOSCreatePaymentRequest request);
        Task<PayOSReturnHandleResult> HandleReturnUrlAsync(PayOSReturnQuery query, Guid userId);
    }

    // 4. Implementation
    public class PayOSService : IPayOSService
    {
        private readonly PayOSConfig _config;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<PayOSService> _logger;
        private readonly IOrderRepository _orderRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly IHttpClientFactory _httpClientFactory;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
            WriteIndented = false
        };

        public PayOSService(
            IOptions<PayOSConfig> config,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<PayOSService> logger,
            IOrderRepository orderRepository,
            IWalletRepository walletRepository,
            IHttpClientFactory httpClientFactory)
        {
            _config = config.Value;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _orderRepository = orderRepository;
            _walletRepository = walletRepository;
            _httpClientFactory = httpClientFactory;
        }
        public async Task<PayOSReturnHandleResult> HandleReturnUrlAsync(PayOSReturnQuery query, Guid userId)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<randox_dbContext>();

            var successId = Guid.Parse("B7165764-E3D5-41D8-A265-E6AC2414FD28");
            var failId = Guid.Parse("64DCB6F8-92FC-4E6E-BD62-A78F350DD708");

            bool isSuccess = string.Equals(query.code, "00", StringComparison.OrdinalIgnoreCase)
                             && !query.cancel
                             && string.Equals(query.status, "PAID", StringComparison.OrdinalIgnoreCase);

            var transaction = await dbContext.Transactions
                .FirstOrDefaultAsync(t => t.PayOsorderCode == query.orderCode);

            if (transaction == null)
            {
                return new PayOSReturnHandleResult
                {
                    Success = false,
                    Message = $"Không tìm thấy transaction với orderCode={query.orderCode}",
                    OrderCode = query.orderCode
                };
            }

            if (transaction.TransactionStatusId == successId)
            {
                return new PayOSReturnHandleResult
                {
                    Success = true,
                    AlreadyProcessed = true,
                    Message = "Giao dịch đã được xử lý trước đó",
                    OrderCode = query.orderCode,
                    TransactionId = transaction.Id
                };
            }

            transaction.TransactionStatusId = isSuccess ? successId : failId;
            transaction.UpdatedAt = TimeHelper.GetVietnamTime();
            transaction.Description = isSuccess
                ? "PayOS - Thanh toán thành công"
                : "PayOS - Thanh toán thất bại";
            var transOrder = await _orderRepository.GetOrderByIdAsync(transaction.Id.ToString());
            if (transOrder?.IsDeposit == true)
            {
                var wa = await dbContext.Wallets.FirstOrDefaultAsync(x => x.Id == userId);
                if (wa != null)
                {
                    wa.Balance += (decimal)transaction.Amount*1000;
                    await _walletRepository.UpdateWalletAsync(wa);
                }

            }

            await dbContext.SaveChangesAsync();

            return new PayOSReturnHandleResult
            {
                Success = isSuccess,
                Message = isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại",
                OrderCode = query.orderCode,
                TransactionId = transaction.Id
            };
        }


        public async Task<PayOSCreatePaymentResponse> CreatePaymentAsync(PayOSCreatePaymentRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.OrderId) || request.Amount < 1000)
                {
                    return new PayOSCreatePaymentResponse
                    {
                        Success = false,
                        Message = "OrderId không hợp lệ hoặc số tiền phải >= 1000 VND"
                    };
                }

                long orderCode = long.Parse($"{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{RandomNumberGenerator.GetInt32(100, 999)}");

                string cleanDescription = System.Text.RegularExpressions.Regex
                    .Replace(request.Description ?? "Thanh toan don hang", @"[^\w\s-.]", "")
                    .Trim();
                if (cleanDescription.Length > 25)
                    cleanDescription = cleanDescription.Substring(0, 25);
                if (string.IsNullOrEmpty(cleanDescription))
                    cleanDescription = "Thanh toan don hang";

                var expiredAt = request.ExpiredAfterMinutes.HasValue
                    ? (int?)DateTimeOffset.UtcNow.AddMinutes(request.ExpiredAfterMinutes.Value).ToUnixTimeSeconds()
                    : null;

                var paymentRequest = new PayOSPaymentRequest
                {
                    orderCode = orderCode,
                    amount = (int)request.Amount,
                    description = cleanDescription,
                    buyerName = request.BuyerName ?? "",
                    buyerEmail = request.BuyerEmail ?? "",
                    buyerPhone = request.BuyerPhone ?? "",
                    buyerAddress = request.BuyerAddress ?? "",
                    items = new List<PayOSItem>
                    {
                        new PayOSItem
                        {
                            name = cleanDescription,
                            quantity = 1,
                            price = (int)request.Amount
                        }
                    },
                    returnUrl = request.ReturnUrl ?? _config.ReturnUrl,
                    cancelUrl = request.CancelUrl ?? _config.CancelUrl,
                    expiredAt = expiredAt
                };

                // Nếu API yêu cầu signature trong body
                if (!string.IsNullOrWhiteSpace(_config.ChecksumKey))
                {
                    paymentRequest.signature = CreateSignatureForPayment(paymentRequest);
                }

                using var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Clear();
                httpClient.DefaultRequestHeaders.Add("x-client-id", _config.ClientId);
                httpClient.DefaultRequestHeaders.Add("x-api-key", _config.ApiKey);

                var json = JsonSerializer.Serialize(paymentRequest, _jsonOptions);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _logger.LogInformation("PayOS Request URL: {Url}", _config.PaymentUrl);
                _logger.LogInformation("PayOS Request Headers: ClientId={ClientId}, ApiKey(prefix)={ApiKeyPrefix}",
                    _config.ClientId, _config.ApiKey?.Substring(0, Math.Min(8, _config.ApiKey?.Length ?? 0)));
                _logger.LogDebug("PayOS Request Body: {Json}", json);

                var response = await httpClient.PostAsync(_config.PaymentUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("PayOS Response: StatusCode={StatusCode}", response.StatusCode);
                _logger.LogDebug("PayOS Response Content: {ResponseContent}", responseContent);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("PayOS HTTP Error: StatusCode={StatusCode}, Response={ResponseContent}",
                        response.StatusCode, responseContent);

                    return new PayOSCreatePaymentResponse
                    {
                        Success = false,
                        Message = $"HTTP Error: {response.StatusCode}"
                    };
                }

                PayOSApiResponse apiResponse;
                try
                {
                    apiResponse = JsonSerializer.Deserialize<PayOSApiResponse>(responseContent, _jsonOptions);
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogError(jsonEx, "Failed to parse PayOS response: {ResponseContent}", responseContent);
                    return new PayOSCreatePaymentResponse
                    {
                        Success = false,
                        Message = "Lỗi parse response từ PayOS"
                    };
                }

                if (apiResponse != null && apiResponse.code == "00")
                {
                    await CreatePendingTransactionAsync(request.OrderId, request.Amount, orderCode);

                    return new PayOSCreatePaymentResponse
                    {
                        CheckoutUrl = apiResponse.data?.checkoutUrl,
                        PaymentLinkId = apiResponse.data?.paymentLinkId,
                        Success = true,
                        Message = "Tạo link thanh toán thành công"
                    };
                }

                _logger.LogError("PayOS API Error: Code={Code}, Desc={Desc}",
                    apiResponse?.code, apiResponse?.desc);

                return new PayOSCreatePaymentResponse
                {
                    Success = false,
                    Message = $"PayOS Error: {apiResponse?.desc ?? "Unknown error"}"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo link thanh toán PayOS cho Order: {OrderId}", request.OrderId);
                return new PayOSCreatePaymentResponse
                {
                    Success = false,
                    Message = "Có lỗi xảy ra khi tạo link thanh toán"
                };
            }
        }

        // ===================== Helpers =====================

        private async Task CreatePendingTransactionAsync(string orderId, decimal amount, long orderCode)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<randox_dbContext>();

            var transaction = new Transaction
            {
                Id = Guid.Parse(orderId),
                Amount = amount,
                Description = "PayOS - Đang chờ thanh toán",
                TransactionStatusId = Guid.Parse("342EFC9C-A6EB-45D9-AC43-E64A3FB8C36E"),
                PaymentLocation = true,
                PayOsorderCode = orderCode,
                CreatedAt = TimeHelper.GetVietnamTime()
            };

            dbContext.Transactions.Add(transaction);
            await dbContext.SaveChangesAsync();
        }

        private static string ComputeHmacSha256(string data, string key)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return Convert.ToHexString(hash).ToLowerInvariant();
        }

        private string CreateSignatureForPayment(PayOSPaymentRequest req)
        {
            var data = $"amount={req.amount}" +
                       $"&cancelUrl={req.cancelUrl}" +
                       $"&description={req.description}" +
                       $"&orderCode={req.orderCode}" +
                       $"&returnUrl={req.returnUrl}";

            return ComputeHmacSha256(data, _config.ChecksumKey);
        }

    }
}
