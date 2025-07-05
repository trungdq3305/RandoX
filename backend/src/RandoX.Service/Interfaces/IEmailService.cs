using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string email, string confirmationLink);
        Task SendPasswordResetAsync(string email, string resetLink);
        Task SendPasswordChangeConfirmationAsync(string email, string confirmationLink);
        Task SendAuctionApprovalAsync(string email, string itemName, string detailLink);
        Task SendAuctionRejectAsync(string email, string itemName, string reason);
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
