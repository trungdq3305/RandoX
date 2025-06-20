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

                cart.TotalAmount = cart.TotalAmount - category.Product.Price * category.Product.Promotion.DiscountValue * category.Amount + category.Product.Price * category.Product.Promotion.DiscountValue * amount;
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
                    CartProducts = categories
                };
                return ApiResponse<CartResponse>.Success(response, "success");
            }
            catch (Exception)
            {
                return ApiResponse<CartResponse>.Failure("Fail to get cart");
            }
        }

        public async Task<ApiResponse<decimal>> RefreshCartTotalAmountAsync(string cartId)
        {
            try
            {
                var cartproducts = await _cartRepository.GetAllInCartAsync(cartId);
                var cart = await _accountRepository.GetCartByUserIdAsync(cartId);
                decimal total = 0;
                foreach (var product in cartproducts)
                {
                    if (product.ProductId != null && product.ProductSetId == null) 
                    {
                        if(product.Product.PromotionId != null)
                        {
                            total = (decimal)(total + product.Product.Price * product.Product.Promotion.DiscountValue);
                        }
                        else
                        {
                            total = (decimal)(total + product.Product.Price);
                        }

                    }
                    else
                    {
                        if (product.ProductSet.PromotionId != null)
                        {
                            total = (decimal)(total + product.ProductSet.Price * product.ProductSet.Promotion.DiscountValue);
                        }
                        else
                        {
                            total = (decimal)(total + product.ProductSet.Price);
                        }
                    }
                    
                }
                return ApiResponse<decimal>.Success(total, "success");
            }
            catch (Exception)
            {
                return ApiResponse<decimal>.Failure("Fail to refresh");
            }
        }
    }
}
