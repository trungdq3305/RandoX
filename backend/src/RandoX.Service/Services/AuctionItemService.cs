using RandoX.Data;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models.AutionModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class AuctionItemService : IAuctionItemService
    {
        private readonly IAuctionRepository _repo;
        private readonly IEmailService _emailService;
        private readonly IAccountRepository _accountRepository;

        public AuctionItemService(IAuctionRepository repo, IEmailService emailService, IAccountRepository accountRepository)
        {
            _repo = repo;
            _emailService = emailService;
            _accountRepository = accountRepository;
        }

        public async Task<AuctionItem> SubmitAuctionItemAsync(AuctionItemRequest request, Guid userId)
        {
            var item = new AuctionItem
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                StartPrice = request.StartPrice,
                StepPrice = request.StepPrice,
                ReservePrice = request.ReservePrice,
                Condition = request.Condition,
                Status = 0, // pending
                UserId = userId,
                CreatedAt = TimeHelper.GetVietnamTime(),
            };

            await _repo.CreateItemAsync(item);
            return item;
        }
        public async Task<bool> ApproveAuctionItemAsync(Guid itemId, DateTime startTime, DateTime endTime)
        {
            var item = await _repo.GetItemByIdAsync(itemId);
            if (item == null || item.Status != 0) return false;

            var result = await _repo.ApproveItemAsync(itemId, startTime, endTime);
            if (result)
            {
                var user = await _accountRepository.GetByIdAsync(item.UserId.ToString());
                var link = $"https://randox.vn/auction/item/{item.Id}";
                await _emailService.SendAuctionApprovalAsync(user.Email, item.Name, link);
            }

            return result;
        }

        public async Task<bool> RejectAuctionItemAsync(Guid itemId, string reason)
        {
            var item = await _repo.GetItemByIdAsync(itemId);
            if (item == null || item.Status != 0) return false;

            var result = await _repo.RejectItemAsync(itemId, reason);
            if (result)
            {
                var user = await _accountRepository.GetByIdAsync(item.UserId.ToString());
                await _emailService.SendAuctionRejectAsync(user.Email, item.Name, reason);
            }

            return result;
        }


    }


}
