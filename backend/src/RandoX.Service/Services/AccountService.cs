﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RandoX.Data;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.AccountModel;
using RandoX.Data.Repositories;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IEmailTokenRepository _tokenRepository;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountService> _logger;
        private readonly IWalletRepository _walletRepository;
        public AccountService(IAccountRepository repository,
        IEmailTokenRepository tokenRepository,
        IEmailService emailService,
        IConfiguration configuration,
        ILogger<AccountService> logger,
        IWalletRepository walletRepository)
        {
            _accountRepository = repository;
            _tokenRepository = tokenRepository;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
            _walletRepository = walletRepository;
        }

        public async Task<Account> Authenticate(string email, string password)
        {
            return await _accountRepository.GetAccount(email, password);
        }

        public async Task<Account> Register(Account account)
        {
            account.Password = BCrypt.Net.BCrypt.HashPassword(account.Password); // hash password
            account.CreatedAt = TimeHelper.GetVietnamTime();
            return await _accountRepository.AddAsync(account);
        }
        public async Task<ApiResponse<Account>> RegisterAsync(RegisterRequest registerDto)
        {
            try
            {
                // Kiểm tra email đã tồn tại
                if (await _accountRepository.EmailExistsAsync(registerDto.Email))
                {
                    var existingAccount = await _accountRepository.GetByEmailAsync(registerDto.Email);

                    if (existingAccount.Status == 0) // Chưa xác nhận
                    {
                        var token1 = GenerateSecureToken();
                        var emailToken1 = new EmailToken
                        {
                            AccountId = existingAccount.Id,
                            Token = token1,
                            TokenType = "EmailConfirmation",
                            CreatedAt = TimeHelper.GetVietnamTime(),
                            ExpiryDate = TimeHelper.GetVietnamTime().AddHours(24)
                        };

                        await _tokenRepository.CreateTokenAsync(emailToken1);

                        var confirmationLink1 = $"{_configuration["AppSettings:BaseUrl"]}/confirm-email?token={token1}&email={registerDto.Email}";
                        await _emailService.SendEmailConfirmationAsync(registerDto.Email, confirmationLink1);

                        return ApiResponse<Account>.Failure("Email đã tồn tại nhưng chưa được xác nhận. Đã gửi lại email xác nhận.");
                    }

                    return ApiResponse<Account>.Failure("Email đã được sử dụng.");
                }

                // Tạo tài khoản mới
                var account = new Account
                {
                    Email = registerDto.Email,
                    Dob = registerDto.Dob,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    PhoneNumber = registerDto.PhoneNumber,
                    RoleId = Guid.Parse(registerDto.RoleId),
                    Status = 0, // Pending confirmation
                    Fullname = registerDto.Fullname,
                };

                var createdAccount = await _accountRepository.CreateAsync(account);

                // Tạo token xác nhận email
                var token = GenerateSecureToken();
                var emailToken = new EmailToken
                {
                    AccountId = createdAccount.Id,
                    Token = token,
                    TokenType = "EmailConfirmation",
                    CreatedAt = TimeHelper.GetVietnamTime(),
                    ExpiryDate = TimeHelper.GetVietnamTime().AddHours(24)
                };

                await _tokenRepository.CreateTokenAsync(emailToken);

                // Gửi email xác nhận
                var confirmationLink = $"{_configuration["AppSettings:BaseUrl"]}/confirm-email?token={token}&email={registerDto.Email}";
                await _emailService.SendEmailConfirmationAsync(registerDto.Email, confirmationLink);

                return ApiResponse<Account>.Success(createdAccount, "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return ApiResponse<Account>.Failure("Có lỗi xảy ra trong quá trình đăng ký");
            }
        }

        public async Task<ApiResponse<bool>> ConfirmEmailAsync(ConfirmEmailDto confirmDto)
        {
            try
            {
                // Kiểm tra token
                var isValidToken = await _tokenRepository.ValidateTokenAsync(confirmDto.Token, confirmDto.Email, "EmailConfirmation");
                if (!isValidToken)
                {
                    return ApiResponse<bool>.Failure("Token không hợp lệ hoặc đã hết hạn");
                }

                // Lấy account
                var account = await _accountRepository.GetByEmailAsync(confirmDto.Email);
                if (account == null)
                {
                    return ApiResponse<bool>.Failure("Tài khoản không tồn tại");
                }

                // Cập nhật status
                account.Status = 1; // Active
                await _accountRepository.UpdateAsync(account);
                var cart = new Cart
                {
                    Id = account.Id,
                    TotalAmount = 0,
                    AccountId = account.Id,
                };
                await _accountRepository.CreateCartAsync(cart);
                var wallet = new Wallet
                {
                    Id = account.Id,
                    Balance = 0,
                };
                await _walletRepository.CreateWalletAsync(wallet);
                // Đánh dấu token đã sử dụng
                var tokenEntity = await _tokenRepository.GetTokenAsync(confirmDto.Token, "EmailConfirmation");
                tokenEntity.IsUsed = true;
                await _tokenRepository.UpdateTokenAsync(tokenEntity);

                return ApiResponse<bool>.Success(true, "Xác nhận email thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email confirmation");
                return ApiResponse<bool>.Failure("Có lỗi xảy ra trong quá trình xác nhận email");
            }
        }

        public async Task<ApiResponse<bool>> RequestPasswordResetAsync(ResetPasswordDto resetDto)
        {
            try
            {
                var account = await _accountRepository.GetByEmailAsync(resetDto.Email);
                if (account == null)
                {
                    // Không tiết lộ thông tin tài khoản có tồn tại hay không
                    return ApiResponse<bool>.Success(true, "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi");
                }

                // Tạo token reset password
                var token = GenerateSecureToken();
                var emailToken = new EmailToken
                {
                    AccountId = account.Id,
                    Token = token,
                    CreatedAt = TimeHelper.GetVietnamTime(),
                    TokenType = "PasswordReset",
                    ExpiryDate = TimeHelper.GetVietnamTime().AddHours(1)
                };

                await _tokenRepository.CreateTokenAsync(emailToken);

                // Gửi email reset password
                var resetLink = $"{_configuration["AppSettings:BaseUrl"]}/reset-password?token={token}&email={resetDto.Email}";
                await _emailService.SendPasswordResetAsync(resetDto.Email, resetLink);

                return ApiResponse<bool>.Success(true, "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset request");
                return ApiResponse<bool>.Failure("Có lỗi xảy ra trong quá trình xử lý");
            }
        }

        public async Task<ApiResponse<bool>> RequestPasswordChangeAsync(ChangePasswordDto changeDto)
        {
            try
            {
                var account = await _accountRepository.GetByEmailAsync(changeDto.Email);
                if (account == null || !BCrypt.Net.BCrypt.Verify(changeDto.CurrentPassword, account.Password))
                {
                    return ApiResponse<bool>.Failure("Email hoặc mật khẩu hiện tại không đúng");
                }

                // Tạo token change password
                var token = GenerateSecureToken();
                var emailToken = new EmailToken
                {
                    AccountId = account.Id,
                    Token = token,
                    TokenType = "PasswordChange",
                    CreatedAt = TimeHelper.GetVietnamTime(),
                    ExpiryDate = TimeHelper.GetVietnamTime().AddHours(1)

                };

                // Lưu mật khẩu mới tạm thời (có thể lưu vào cache hoặc bảng riêng)
                // Ở đây tôi sẽ lưu hash của mật khẩu mới vào một trường tạm thời

                await _tokenRepository.CreateTokenAsync(emailToken);

                // Gửi email xác nhận thay đổi mật khẩu
                var confirmationLink = $"{_configuration["AppSettings:BaseUrl"]}/api/account/confirm-password-change?token={token}";
                await _emailService.SendPasswordChangeConfirmationAsync(changeDto.Email, confirmationLink);

                return ApiResponse<bool>.Success(true, "Email xác nhận thay đổi mật khẩu đã được gửi");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password change request");
                return ApiResponse<bool>.Failure("Có lỗi xảy ra trong quá trình xử lý");
            }
        }

        public async Task<ApiResponse<bool>> ConfirmPasswordResetAsync(string token, string newPassword)
        {
            try
            {
                var tokenEntity = await _tokenRepository.GetTokenAsync(token, "PasswordReset");
                if (tokenEntity == null)
                {
                    return ApiResponse<bool>.Failure("Token không hợp lệ hoặc đã hết hạn");
                }

                // Cập nhật mật khẩu
                var account = tokenEntity.Account;
                account.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await _accountRepository.UpdateAsync(account);

                // Đánh dấu token đã sử dụng
                tokenEntity.IsUsed = true;
                await _tokenRepository.UpdateTokenAsync(tokenEntity);

                return ApiResponse<bool>.Success(true, "Đặt lại mật khẩu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset confirmation");
                return ApiResponse<bool>.Failure("Có lỗi xảy ra trong quá trình đặt lại mật khẩu");
            }
        }

        public async Task<ApiResponse<bool>> ConfirmPasswordChangeAsync(string token)
        {
            try
            {
                var tokenEntity = await _tokenRepository.GetTokenAsync(token, "PasswordChange");
                if (tokenEntity == null)
                {
                    return ApiResponse<bool>.Failure("Token không hợp lệ hoặc đã hết hạn");
                }

                // Đánh dấu token đã sử dụng
                tokenEntity.IsUsed = true;
                await _tokenRepository.UpdateTokenAsync(tokenEntity);

                return ApiResponse<bool>.Success(true, "Xác nhận thay đổi mật khẩu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password change confirmation");
                return ApiResponse<bool>.Failure("Có lỗi xảy ra trong quá trình xác nhận");
            }
        }

        private string GenerateSecureToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes).Replace("/", "_").Replace("+", "-").Replace("=", "");
        }

        public async Task<Account> GetAccountByEmailAsync(string email)
        {
            return await _accountRepository.GetByEmailAsync(email);
        }
        public async Task<List<AccountSummaryDto>> GetAllAccountsAsync()
        {
            var accounts = await _accountRepository.GetAllAsync();
            return accounts.Select(a => new AccountSummaryDto
            {
                Id = a.Id,
                Email = a.Email,
                Dob = a.Dob,
                PhoneNumber = a.PhoneNumber,
                Status = a.Status,
                RoleId = a.RoleId,
                RoleName = a.Role?.RoleName,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Fullname = a.Fullname
            }).ToList();
        }

        public async Task<ApiResponse<bool>> UpdateAccountAsync(Guid id, UpdateAccountDto dto)
        {
            var acc = await _accountRepository.GetByIdAsync(id.ToString());
            if (acc == null)
                return ApiResponse<bool>.Failure("Tài khoản không tồn tại");

            acc.PhoneNumber = dto.PhoneNumber;
            acc.Dob = dto.Dob;
            acc.Status = dto.Status;
            acc.RoleId = dto.RoleId;
            acc.UpdatedAt = TimeHelper.GetVietnamTime();
            acc.Fullname = dto.Fullname;

            await _accountRepository.UpdateAsync(acc);
            return ApiResponse<bool>.Success(true, "Cập nhật thành công");
        }

        public async Task<ApiResponse<bool>> DeleteAccountAsync(Guid id)
        {
            var acc = await _accountRepository.GetByIdAsync(id.ToString());
            if (acc == null)
                return ApiResponse<bool>.Failure("Tài khoản không tồn tại");

            acc.IsDeleted = true;
            acc.UpdatedAt = TimeHelper.GetVietnamTime();
            await _accountRepository.UpdateAsync(acc);

            return ApiResponse<bool>.Success(true, "Đã xóa tài khoản");
        }


    }
}
