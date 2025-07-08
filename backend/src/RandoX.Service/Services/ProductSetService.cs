using RandoX.Common;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.ProductSetModel;
using RandoX.Data.Repositories;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class ProductSetService : IProductSetService
    {
        private readonly IProductSetRepository _productSetRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ICartService _cartService;
        private readonly randox_dbContext _context;
        public ProductSetService(IProductSetRepository productSetRepository,
                         IAccountRepository accountRepository,
                         ICartRepository cartRepository,
                         ICartService cartService,
                         randox_dbContext context) // 👈 thêm vào
        {
            _productSetRepository = productSetRepository;
            _accountRepository = accountRepository;
            _cartRepository = cartRepository;
            _cartService = cartService;
            _context = context;
        }

        public async Task<ApiResponse<PaginationResult<ProductSetDetailDto>>> GetAllProductSetsAsync(int pageNumber, int pageSize)
        {
            try
            {
                var productSets = await _productSetRepository.GetAllProductSetsAsync();

                var productSetDtos = productSets.Select(MapToDto).ToList();
                var paginatedResult = new PaginationResult<ProductSetDetailDto>(productSetDtos, productSetDtos.Count, pageNumber, pageSize);

                return ApiResponse<PaginationResult<ProductSetDetailDto>>.Success(paginatedResult, "Successfully retrieved product sets.");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<ProductSetDetailDto>>.Failure("Failed to retrieve product sets.");
            }
        }


        public async Task<ApiResponse<ProductSetDetailDto>> GetProductSetByIdAsync(string id)
        {
            try
            {
                var productSet = await _productSetRepository.GetProductSetByIdAsync(id);

                if (productSet == null)
                    return ApiResponse<ProductSetDetailDto>.Failure("Product set not found");

                var dto = MapToDto(productSet);
                return ApiResponse<ProductSetDetailDto>.Success(dto, "Successfully retrieved product set.");
            }
            catch (Exception)
            {
                return ApiResponse<ProductSetDetailDto>.Failure("Failed to retrieve product set.");
            }
        }

        private ProductSetDetailDto MapToDto(ProductSet productSet)
        {
            var imageUrl = _context.Images
                .Where(i => i.ProductId == productSet.ProductId && i.IsDeleted != true)
                .Select(i => i.ImageUrl)
                .FirstOrDefault();

            return new ProductSetDetailDto
            {
                Id = productSet.Id,
                ProductSetName = productSet.ProductSetName,
                Description = productSet.Description,
                SetQuantity = productSet.SetQuantity,
                Quantity = productSet.Quantity,
                Price = productSet.Price,

                PromotionEvent = productSet.Promotion?.Event,
                PercentageDiscountValue = productSet.Promotion?.PercentageDiscountValue,
                DiscountValue = productSet.Promotion?.DiscountValue,
                ProductId = productSet.Product.Id,
                ProductName = productSet.Product?.ProductName,
                ImageUrl = imageUrl // 👈 Gán URL ảnh
            };
        }

        public async Task<ApiResponse<ProductSet>> CreateProductSetAsync(ProductSetRequest productSetRequest)
        {
            try
            {
                var productSet = new ProductSet
                {
                    Id = Guid.NewGuid(),
                    ProductSetName = productSetRequest.ProductSetName,
                    Description = productSetRequest.Description,
                    SetQuantity = productSetRequest.SetQuantity,
                    Quantity = productSetRequest.Quantity,
                    Price = productSetRequest.Price,
                    ProductId = productSetRequest.ProductId,
                };

                await _productSetRepository.CreateProductSetAsync(productSet);

                return ApiResponse<ProductSet>.Success(productSet, "Product set created successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductSet>.Failure("Failed to create product set.");
            }
        }

        public async Task<ApiResponse<ProductSet>> UpdateProductSetAsync(string id, ProductSetRequest productSetRequest)
        {
            try
            {
                var productSet = await _productSetRepository.GetProductSetByIdAsync(id);
                if (productSet == null)
                {
                    return ApiResponse<ProductSet>.Failure("Product set not found.");
                }

                productSet.ProductSetName = productSetRequest.ProductSetName;
                productSet.Description = productSetRequest.Description;
                productSet.SetQuantity = productSetRequest.SetQuantity;
                productSet.Quantity = productSetRequest.Quantity;
                productSet.Price = productSetRequest.Price;

                await _productSetRepository.UpdateProductSetAsync(productSet);

                return ApiResponse<ProductSet>.Success(productSet, "Product set updated successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductSet>.Failure("Failed to update product set.");
            }
        }

        public async Task<ApiResponse<ProductSet>> DeleteProductSetAsync(string id)
        {
            try
            {
                var productSet = await _productSetRepository.DeleteProductSetAsync(id);
                return productSet != null ? ApiResponse<ProductSet>.Success(productSet, "Product set deleted successfully.") : ApiResponse<ProductSet>.Failure("Product set not found.");
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductSet>.Failure("Failed to delete product set.");
            }
        }
        public async Task<ApiResponse<ProductSet>> UpdateProToProductSetAsync(string id, string proId)
        {
            try
            {
                var productSet = await _productSetRepository.GetProductSetByIdAsync(id);
                if (productSet == null)
                {
                    return ApiResponse<ProductSet>.Failure("Product set not found.");
                }

                productSet.PromotionId = Guid.Parse(proId);

                await _productSetRepository.UpdateProductSetAsync(productSet);

                return ApiResponse<ProductSet>.Success(productSet, "promotion updated successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductSet>.Failure("Failed to update product set.");
            }
        }
        public async Task<ApiResponse<ProductSet>> DeletePromotionAsync(string id)
        {
            try
            {
                ProductSet productSet = await _productSetRepository.GetProductSetByIdAsync(id);

                productSet.PromotionId = null;


                await _productSetRepository.UpdateProductSetAsync(productSet);

                return ApiResponse<ProductSet>.Success(productSet, "success");
            }
            catch (Exception)
            {
                return ApiResponse<ProductSet>.Failure("Fail to delete promotion ");
            }
        }
        public async Task<ApiResponse<CartProduct>> AddSetToCartAsync(string userId, string setId, int amount)
        {
            var cart = await _accountRepository.GetCartByUserIdAsync(userId);
            var set = await _productSetRepository.GetProductSetByIdAsync(setId);

            // Kiểm tra xem set đã có trong giỏ hàng chưa (và chưa bị xóa)
            var existingCartSet = cart.CartProducts
                .FirstOrDefault(cp => cp.ProductSetId == Guid.Parse(setId) && (cp.IsDeleted == null || cp.IsDeleted == false));

            if (existingCartSet != null)
            {
                return ApiResponse<CartProduct>.Failure("Set đã có trong giỏ hàng.");
            }

            var cartProduct = new CartProduct
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductSetId = Guid.Parse(setId),
                Amount = amount
            };

            await _cartService.RefreshCartTotalAmountAsync(userId);
            await _cartRepository.UpdateCartAsync(cart);

            var result = await _productSetRepository.AddSetToCartAsync(cartProduct);
            return ApiResponse<CartProduct>.Success(result, "success");
        }

    }

}
