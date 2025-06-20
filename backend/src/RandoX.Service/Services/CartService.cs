using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.CartModel;
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
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IAccountRepository _accountRepository;
        public CartService(ICartRepository cartRepository, IAccountRepository accountRepository)
        {
            _cartRepository = cartRepository;
            _accountRepository = accountRepository;
        }

        public async Task<ApiResponse<CartProduct>> UpdateCartProductAmountAsync(string id, int amount, string cartId)
        {
            try
            {
                var category = await _cartRepository.GetCartProductByIdAsync(id);
                var cart = await _accountRepository.GetCartByUserIdAsync(cartId);
                if (category == null)
                {
                    return ApiResponse<CartProduct>.Failure("Cartproduct not found");
                }

                cart.TotalAmount = cart.TotalAmount - category.Product.Price * category.Amount + category.Product.Price * amount;
                await _cartRepository.UpdateCartAsync(cart);

                category.Amount = amount;
                await _cartRepository.UpdateCartProductAsync(category);

                return ApiResponse<CartProduct>.Success(category, "Cartproduct updated successfully");
            }
            catch (Exception)
            {
                return ApiResponse<CartProduct>.Failure("Fail to update category");
            }
        }
        public async Task<ApiResponse<CartResponse>> GetAllInCartAsync(int pageNumber, int pageSize, string cartId)
        {
            try
            {
                var categories = await _cartRepository.GetAllInCartAsync(cartId);
                var cart = await _accountRepository.GetCartByUserIdAsync(cartId);

                var paginatedResult = new PaginationResult<CartProduct>(categories.ToList(), categories.Count(), pageNumber, pageSize);
                var response = new CartResponse
                {
                    Id = Guid.Parse(cartId),
                    TotalAmount = cart.TotalAmount,
                    CartProducts = categories
                };
                return ApiResponse<CartResponse>.Success(response, "success");
            }
            catch (Exception)
            {
                return ApiResponse<CartResponse>.Failure("Fail to get cart");
            }
        }
    }
}
