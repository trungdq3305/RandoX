using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.Category;
using RandoX.Data.Repositories;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IVoucherRepository _voucherRepository;
        public OrderService(IOrderRepository orderRepository, IAccountRepository accountRepository, IVoucherRepository voucherRepository)
        {
            _orderRepository = orderRepository;
            _accountRepository = accountRepository;
            _voucherRepository = voucherRepository;
        }

        public async Task<Order> GetOrderByIdAsync(string orderId)
        {
            return await _orderRepository.GetOrderByIdAsync(orderId);
        }

        public async Task<ApiResponse<Order>> CreateOrderAsync(string cartId, decimal shippingCost, string? voucherId)
        {
            try
            {
                var cart = await _accountRepository.GetCartByUserIdAsync(cartId);
                Order order = new Order();
                if (voucherId != null)
                {
                    var voucher = await _voucherRepository.GetVoucherByIdAsync(voucherId);
                    order = new Order
                    {
                        Id = Guid.NewGuid(),
                        CartId = Guid.Parse(cartId),
                        TotalAmount = cart.TotalAmount - voucher.VoucherDiscountAmount,
                        ShippingCost = shippingCost,
                        VoucherId = Guid.Parse(voucherId),
                    };
                }
                else {                     
                    order = new Order
                    {
                        Id = Guid.NewGuid(),
                        CartId = Guid.Parse(cartId),
                        TotalAmount = cart.TotalAmount,
                        ShippingCost = shippingCost,
                        VoucherId = null,
                    };
                }



                await _orderRepository.CreateOrderAsync(order);

                return ApiResponse<Order>.Success(order, "order created successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Order>.Failure("Fail to create order");
            }
        }
    }
}
