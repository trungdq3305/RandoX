﻿using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RandoX.Data.Models.EmailModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendEmailConfirmationAsync(string email, string confirmationLink)
        {
            var subject = "Xác nhận tài khoản";
            var body = $@"
            <h2>Xác nhận tài khoản của bạn</h2>
            <p>Chào bạn,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấn vào liên kết bên dưới để xác nhận email của bạn:</p>
            <p><a href='{confirmationLink}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Xác nhận Email</a></p>
            <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ hỗ trợ</p>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetAsync(string email, string resetLink)
        {
            var subject = "Đặt lại mật khẩu";
            var body = $@"
            <h2>Đặt lại mật khẩu</h2>
            <p>Chào bạn,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết bên dưới:</p>
            <p><a href='{resetLink}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Đặt lại mật khẩu</a></p>
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ hỗ trợ</p>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordChangeConfirmationAsync(string email, string confirmationLink)
        {
            var subject = "Xác nhận thay đổi mật khẩu";
            var body = $@"
            <h2>Xác nhận thay đổi mật khẩu</h2>
            <p>Chào bạn,</p>
            <p>Bạn đã yêu cầu thay đổi mật khẩu. Vui lòng nhấn vào liên kết bên dưới để xác nhận:</p>
            <p><a href='{confirmationLink}' style='background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Xác nhận thay đổi</a></p>
            <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ hỗ trợ</p>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort);
                client.EnableSsl = _emailSettings.EnableSsl;
                client.Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                throw;
            }
        }
        public async Task SendAuctionApprovalAsync(string email, string itemName, string detailLink)
        {
            var subject = "Vật phẩm của bạn đã được duyệt";
            var body = $@"
        <h2>Xin chúc mừng!</h2>
        <p>Vật phẩm <strong>{itemName}</strong> của bạn đã được duyệt để đưa lên đấu giá.</p>
        <p>Nhấn vào nút bên dưới để xem chi tiết:</p>
        <p><a href='{detailLink}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Xem chi tiết</a></p>
        <p>Chúc bạn đấu giá thành công!</p>
        <p>Đội ngũ RandoX</p>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendAuctionRejectAsync(string email, string itemName, string reason)
        {
            var subject = "Vật phẩm của bạn bị từ chối";
            var body = $@"
        <h2>Thông báo từ chối vật phẩm</h2>
        <p>Rất tiếc! Vật phẩm <strong>{itemName}</strong> của bạn đã bị từ chối.</p>
        <p>Lý do: <em>{reason}</em></p>
        <p>Nếu có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ RandoX</p>";

            await SendEmailAsync(email, subject, body);
        }

    }
}
