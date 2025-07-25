﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RandoX.Data;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace RandoX.Common
{
    // 1. VNPay Configuration Model
    public class VNPayConfig
    {
        public string TmnCode { get; set; }
        public string HashSecret { get; set; }
        public string PaymentUrl { get; set; }
        public string ReturnUrl { get; set; }
        public string Version { get; set; } = "2.1.0";
        public string Command { get; set; } = "pay";
    }

    // 2. VNPay Request Models
    public class VNPayCreatePaymentRequest
    {
        public string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; }
        public string IpAddress { get; set; }
        public string Locale { get; set; } = "vn";
        public string CurrCode { get; set; } = "VND";
    }

    public class VNPayCreatePaymentResponse
    {
        public string PaymentUrl { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class VNPayCallbackRequest
    {
        public string vnp_Amount { get; set; }
        public string? vnp_BankCode { get; set; } // Optional - có thể null khi thanh toán thất bại
        public string? vnp_BankTranNo { get; set; } // Optional - không có khi thanh toán thất bại  
        public string? vnp_CardType { get; set; } // Optional
        public string vnp_OrderInfo { get; set; }
        public string? vnp_PayDate { get; set; } // Optional - không có khi thanh toán thất bại
        public string vnp_ResponseCode { get; set; }
        public string vnp_TmnCode { get; set; }
        public string? vnp_TransactionNo { get; set; } // Optional - không có khi thanh toán thất bại
        public string vnp_TransactionStatus { get; set; }
        public string vnp_TxnRef { get; set; }
        public string vnp_SecureHash { get; set; }
    }

    // 3. VNPay Service Interface
    public interface IVNPayService
    {
        Task<VNPayCreatePaymentResponse> CreatePaymentAsync(VNPayCreatePaymentRequest request);
        Task<bool> ValidateCallbackAsync(VNPayCallbackRequest callback);
        Task  ProcessPaymentCallbackAsync(VNPayCallbackRequest callback, string userid);
    }

    // 4. VNPay Service Implementation
    public class VNPayService : IVNPayService
    {
        private readonly VNPayConfig _config;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<VNPayService> _logger;
        private readonly IOrderRepository _orderRepository;
        private readonly IWalletRepository _walletRepository;
        public VNPayService(
            IOptions<VNPayConfig> config,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<VNPayService> logger,
            IOrderRepository orderRepository,
            IWalletRepository walletRepository)
        {
            _config = config.Value;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _orderRepository = orderRepository;
            _walletRepository = walletRepository;
        }

        public async Task<VNPayCreatePaymentResponse> CreatePaymentAsync(VNPayCreatePaymentRequest request)
        {
            try
            {
                var vnpay = new VnPayLibrary();

                // Thêm các tham số bắt buộc
                vnpay.AddRequestData("vnp_Version", _config.Version);
                vnpay.AddRequestData("vnp_Command", _config.Command);
                vnpay.AddRequestData("vnp_TmnCode", _config.TmnCode);
                vnpay.AddRequestData("vnp_Amount", ((long)(request.Amount * 100)).ToString());
                vnpay.AddRequestData("vnp_CreateDate", TimeHelper.GetVietnamTime().ToString("yyyyMMddHHmmss"));
                vnpay.AddRequestData("vnp_CurrCode", request.CurrCode);
                vnpay.AddRequestData("vnp_IpAddr", request.IpAddress);
                vnpay.AddRequestData("vnp_Locale", request.Locale);
                vnpay.AddRequestData("vnp_OrderInfo", request.OrderInfo);
                vnpay.AddRequestData("vnp_OrderType", "other");
                vnpay.AddRequestData("vnp_ReturnUrl", _config.ReturnUrl);
                vnpay.AddRequestData("vnp_TxnRef", request.OrderId);

                // Tạo URL thanh toán
                string paymentUrl = vnpay.CreateRequestUrl(_config.PaymentUrl, _config.HashSecret);

                // Lưu thông tin transaction với status pending
                await CreatePendingTransactionAsync(request.OrderId, request.Amount);

                return new VNPayCreatePaymentResponse
                {
                    PaymentUrl = paymentUrl,
                    Success = true,
                    Message = "Tạo link thanh toán thành công"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo link thanh toán VNPay cho Order: {OrderId}", request.OrderId);
                return new VNPayCreatePaymentResponse
                {
                    Success = false,
                    Message = "Có lỗi xảy ra khi tạo link thanh toán"
                };
            }
        }

        public async Task<bool> ValidateCallbackAsync(VNPayCallbackRequest callback)
        {
            try
            {
                var vnpay = new VnPayLibrary();

                // Thêm tất cả tham số trừ secure hash
                foreach (var prop in typeof(VNPayCallbackRequest).GetProperties())
                {
                    if (prop.Name == "vnp_SecureHash") continue;

                    var value = prop.GetValue(callback)?.ToString();
                    if (!string.IsNullOrEmpty(value))
                    {
                        vnpay.AddResponseData(prop.Name, value);
                    }
                }

                // Validate secure hash
                bool isValid = vnpay.ValidateSignature(callback.vnp_SecureHash, _config.HashSecret);
                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi validate callback VNPay");
                return false;
            }
        }

        public async Task ProcessPaymentCallbackAsync(VNPayCallbackRequest callback, string userid)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<randox_dbContext>();

            try
            {
                var transaction = await dbContext.Transactions
                    .FirstOrDefaultAsync(t => t.Id == Guid.Parse(callback.vnp_TxnRef));

                if (transaction == null)
                {
                    _logger.LogWarning("Không tìm thấy transaction với ID: {TransactionId}", callback.vnp_TxnRef);
                    return;
                }

                // Cập nhật trạng thái transaction
                string statusId = GetTransactionStatusId(callback.vnp_ResponseCode);
                transaction.TransactionStatusId = Guid.Parse(statusId);
                transaction.UpdatedAt = TimeHelper.GetVietnamTime();

                if (callback.vnp_ResponseCode == "00") // Thành công
                {
                    // Chỉ cập nhật PayDate khi có vnp_PayDate và thanh toán thành công
                    if (!string.IsNullOrEmpty(callback.vnp_PayDate))
                    {
                        transaction.PayDate = DateOnly.FromDateTime(DateTime.ParseExact(callback.vnp_PayDate, "yyyyMMddHHmmss", null));
                    }

                    // Sử dụng vnp_TransactionNo nếu có, nếu không thì dùng vnp_TxnRef
                    string transactionNo = !string.IsNullOrEmpty(callback.vnp_TransactionNo)
                        ? callback.vnp_TransactionNo
                        : callback.vnp_TxnRef;

                    transaction.Description = $"VNPay - {callback.vnp_OrderInfo} - Mã giao dịch: {transactionNo}";

                    var transOrder = await _orderRepository.GetOrderByIdAsync(transaction.Id.ToString());
                    if (transOrder.IsDeposit != false)
                    {
                        var wa = await dbContext.Wallets.FirstOrDefaultAsync(x => x.Id == Guid.Parse(userid));
                        wa.Balance += (decimal)transaction.Amount;
                        _walletRepository.UpdateWalletAsync(wa);
                    }
                }
                else
                {
                    // Thanh toán thất bại - không có thông tin ngân hàng
                    transaction.Description = $"VNPay - Thanh toán thất bại - Mã lỗi: {callback.vnp_ResponseCode} - {GetResponseMessage(callback.vnp_ResponseCode)}";
                }

                await dbContext.SaveChangesAsync();

                var order = await dbContext.Orders.Include(x => x.Cart).FirstOrDefaultAsync(x => x.Id == transaction.Id);
                var cartProducts = await dbContext.CartProducts.Where(x => x.CartId == order.CartId).ToListAsync();
                if (order == null || order.CartId == null)
                {
                    _logger.LogWarning("Không tìm thấy đơn hàng hoặc CartId null cho transaction: {TransactionId}", transaction.Id);
                    
                }
                foreach (var item in cartProducts)
                {
                    if(item.ProductId != null)
                    {
                        var product = await dbContext.Products.FirstOrDefaultAsync(x => x.Id == item.ProductId);
                        product.Quantity = product.Quantity - item.Amount;
                        dbContext.Products.Update(product);
                    }
                    else
                    {
                        var set = await dbContext.ProductSets.FirstOrDefaultAsync(x => x.Id == item.ProductSetId);
                        set.Quantity = set.Quantity - item.Amount;
                        dbContext.ProductSets.Update(set);
                        
                    }
                }
                await dbContext.SaveChangesAsync();
                _logger.LogInformation("Cập nhật trạng thái transaction thành công: {TransactionId}, ResponseCode: {ResponseCode}",
                    callback.vnp_TxnRef, callback.vnp_ResponseCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý callback VNPay cho transaction: {TransactionId}, ResponseCode: {ResponseCode}",
                    callback.vnp_TxnRef, callback.vnp_ResponseCode);
                throw;
            }
        }
        private string GetResponseMessage(string responseCode)
        {
            return responseCode switch
            {
                "00" => "Giao dịch thành công",
                "07" => "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
                "09" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng",
                "10" => "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
                "11" => "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch",
                "12" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa",
                "13" => "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)",
                "24" => "Giao dịch không thành công do: Khách hàng hủy giao dịch",
                "51" => "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
                "65" => "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày",
                "75" => "Ngân hàng thanh toán đang bảo trì",
                "79" => "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định",
                "99" => "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
                _ => "Giao dịch không thành công"
            };
        }
        private async Task CreatePendingTransactionAsync(string orderId, decimal amount)
        {
            try
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<randox_dbContext>();

                var transaction = new Transaction
                {
                    Id = Guid.Parse(orderId), // Sử dụng OrderId làm TransactionId
                    Amount = amount,
                    Description = "VNPay - Đang chờ thanh toán",
                    TransactionStatusId = Guid.Parse("342EFC9C-A6EB-45D9-AC43-E64A3FB8C36E"), // ID của status pending trong bảng TransactionStatus
                                                                                              //PaymentTypeId = "vnpay", // ID của payment type VNPay
                    PaymentLocation = true, // Online payment
                    CreatedAt = TimeHelper.GetVietnamTime()
                };

                dbContext.Transactions.Add(transaction);
                await dbContext.SaveChangesAsync();
            } catch (Exception ex) {
                throw new Exception(ex.ToString());
                    }
            
        }

        private string GetTransactionStatusId(string responseCode)
        {
            return responseCode switch
            {
                "00" => "B7165764-E3D5-41D8-A265-E6AC2414FD28", // ID của status success
                _ => "64DCB6F8-92FC-4E6E-BD62-A78F350DD708" // ID của status fail
            };
        }
    }

    // 5. VNPay Library Helper (Tải từ VNPay documentation)
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new();
        private readonly SortedList<string, string> _responseData = new();

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            string queryString = data.ToString();
            if (queryString.Length > 0)
            {
                queryString = queryString.Remove(data.Length - 1, 1);
            }

            string signData = queryString;
            string vnpSecureHash = HmacSha512(vnp_HashSecret, signData);
            string paymentUrl = baseUrl + "?" + queryString + "&vnp_SecureHash=" + vnpSecureHash;

            return paymentUrl;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            string rspRaw = GetResponseData();
            string myChecksum = HmacSha512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }
            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }
            return data.ToString();
        }

        private static string HmacSha512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (byte theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }
            return hash.ToString();
        }
    }
}
