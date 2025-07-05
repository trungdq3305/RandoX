using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace RandoX.API.Hubs
{
    public class AuctionHub : Hub
    {
        // Gửi thông báo khi có người đặt giá mới
        public async Task NotifyNewBid(Guid sessionId, string bidderName, decimal amount)
        {
            await Clients.Group(sessionId.ToString())
                .SendAsync("ReceiveNewBid", bidderName, amount);
        }

        // Người dùng tham gia nhóm (phòng)
        public async Task JoinSession(Guid sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());
        }

        public async Task LeaveSession(Guid sessionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId.ToString());
        }
    }
}
