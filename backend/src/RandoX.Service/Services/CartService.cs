using RandoX.Common;
using RandoX.Data;
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
        private readonly IProductRepository _productRepository;
        private readonly IProductSetRepository _productSetRepository;
        public CartService(ICartRepository cartRepository, IAccountRepository accountRepository, IProductRepository productRepository, IProductSetRepository productSetRepository)
        {
            _cartRepository = cartRepository;
            _accountRepository = accountRepository;
            _productRepository = productRepository;
            _productSetRepository = productSetRepository;
        }

        public async Task<ApiResponse<CartProduct>> UpdateCartProductAmountAsync(string id, int amount, string cartId)
        {
            try
            {
                var category = await _cartRepository.GetCartProductByIdAsync(id);
                if (category == null)
                {
                    return ApiResponse<CartProduct>.Failure("Cartproduct not found");
                }
                await RefreshCartTotalAmountAsync(cartId);
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
                var cartProducts = await _cartRepository.GetAllInCartAsync(cartId);
                var cart = await _accountRepository.GetCartByUserIdAsync(cartId);

                var cartProductDtos = new List<CartProductDto>();

                foreach (var cp in cartProducts)
                {
                    var dto = new CartProductDto
                    {
                        Id = cp.Id,
                        Amount = cp.Amount
                    };

                    if (cp.ProductId != null)
                    {
                        var product = await _productRepository.GetProductByIdAsync(cp.ProductId.ToString());
                        dto.ProductName = product?.ProductName;
                        dto.Price = product?.Price;
                        dto.PercentageDiscountValue = product?.Promotion?.PercentageDiscountValue;
                        dto.DiscountValue = product?.Promotion?.DiscountValue;

                        // 👇 Lấy ảnh từ bảng Images (nếu có)
                        dto.ImageUrl = product?.Images?.FirstOrDefault(i => i.IsDeleted != true)?.ImageUrl;
                    }

                    if (cp.ProductSetId != null)
                    {
                        var productSet = await _productSetRepository.GetProductSetByIdAsync(cp.ProductSetId.ToString());
                        dto.ProductSetName = productSet?.ProductSetName;
                        dto.Price = productSet?.Price;
                        dto.PercentageDiscountValue = productSet?.Promotion?.PercentageDiscountValue;
                        dto.DiscountValue = productSet?.Promotion?.DiscountValue;

                        // 👇 Lấy ảnh từ Product gốc nếu ProductSet không có ảnh riêng
                        dto.ImageUrl = productSet?.Product?.Images?.FirstOrDefault(i => i.IsDeleted != true)?.ImageUrl;
                    }

                    cartProductDtos.Add(dto);
                }



                var response = new CartResponse
                {
                    Id = Guid.Parse(cartId),
                    CartProducts = cartProductDtos
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
                cart.TotalAmount = total;
                await _cartRepository.UpdateCartAsync(cart);
                return ApiResponse<decimal>.Success(total, "success");
            }
            catch (Exception)
            {
                return ApiResponse<decimal>.Failure("Fail to refresh");
            }
        }
        public async Task<ApiResponse<string>> ClearCartAsync(string userId)
        {
            try
            {
                var cart = await _accountRepository.GetCartByUserIdAsync(userId);
                if (cart == null) return ApiResponse<string>.Failure("Cart not found");

                var cartProducts = await _cartRepository.GetAllInCartAsync(cart.Id.ToString());
                foreach (var product in cartProducts)
                {
                    product.IsDeleted = true;
                    product.UpdatedAt = TimeHelper.GetVietnamTime();
                }

                await _cartRepository.UpdateCartProductsAsync(cartProducts); // Viết method này nếu chưa có
                return ApiResponse<string>.Success("Cart cleared successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.Failure("Failed to clear cart");
            }
        }

    }
}
