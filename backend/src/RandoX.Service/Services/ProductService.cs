using Microsoft.EntityFrameworkCore;
using RandoX.Common;
using RandoX.Data;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.ProductModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ICartService _cartService;
        private readonly randox_dbContext _context;
        private readonly BlobService _blobService;
        public ProductService(IProductRepository productRepository, IAccountRepository accountRepository, ICartRepository cartRepository, ICartService cartService, randox_dbContext context, BlobService blobService)
        {
            _productRepository = productRepository;
            _accountRepository = accountRepository;
            _cartRepository = cartRepository;
            _cartService = cartService;
            _context = context;
            _blobService = blobService;
        }
        public async Task<ApiResponse<PaginationResult<ProductDetailDto>>> GetAllProductsAsync(int pageNumber, int pageSize)
        {
            try
            {
                var products = await _productRepository.GetAllProductsAsync();

                var productDtos = products.Select(MapToDto).ToList();
                var paginatedResult = new PaginationResult<ProductDetailDto>(productDtos, productDtos.Count, pageNumber, pageSize);

                return ApiResponse<PaginationResult<ProductDetailDto>>.Success(paginatedResult, "success");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<ProductDetailDto>>.Failure("Fail to get all product");
            }
        }

        public async Task<ApiResponse<ProductDetailDto>> GetProductByIdAsync(string id)
        {
            try
            {
                var product = await _productRepository.GetProductByIdAsync(id);

                if (product == null)
                    return ApiResponse<ProductDetailDto>.Failure("Product not found");

                var dto = MapToDto(product);
                return ApiResponse<ProductDetailDto>.Success(dto, "success");
            }
            catch (Exception)
            {
                return ApiResponse<ProductDetailDto>.Failure("Fail to get product");
            }
        }

        private ProductDetailDto MapToDto(Product product)
        {
            var image = _context.Images
                .Where(i => i.ProductId == product.Id && i.IsDeleted != true)
                .Select(i => i.ImageUrl)
                .FirstOrDefault();

            var productSetId = product.ProductSets?.FirstOrDefault()?.Id;

            return new ProductDetailDto
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Description = product.Description,
                Quantity = product.Quantity,
                Price = product.Price,
                ManufacturerName = product.Manufacturer?.ManufacturerName,
                CategoryName = product.Category?.CategoryName,
                PromotionEvent = product.Promotion?.Event,
                PercentageDiscountValue = product.Promotion?.PercentageDiscountValue,
                DiscountValue = product.Promotion?.DiscountValue,
                ImageUrl = image,

                // ✅ Gán ProductSetId
                ProductSetId = productSetId
            };
        }


        public async Task<ApiResponse<ProductRequest>> CreateProductAsync(ProductRequest productRequest)
        {
            try
            {
                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    ProductName = productRequest.ProductName,
                    Description = productRequest.Description,
                    Quantity = productRequest.Quantity,
                    Price = productRequest.Price,
                    ManufacturerId = Guid.Parse(productRequest.ManufacturerId),
                    CategoryId = Guid.Parse(productRequest.CategoryId)
                };

                await _productRepository.CreateProductAsync(product);

                // 👇 Nếu có ảnh, upload lên Blob và lưu vào bảng Images
                if (productRequest.Image != null && productRequest.Image.Length > 0)
                {
                    var imageUrl = await _blobService.UploadImageAsync(productRequest.Image);

                    var image = new Image
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        CreatedAt = TimeHelper.GetVietnamTime(),
                        IsDeleted = false
                    };

                    _context.Images.Add(image);
                    await _context.SaveChangesAsync();
                }

                return ApiResponse<ProductRequest>.Success(productRequest, "Product created successfully");
            }
            catch (Exception)
            {
                return ApiResponse<ProductRequest>.Failure("Failed to create product");
            }
        }


        public async Task<ApiResponse<ProductRequest>> UpdateProductAsync(string id, ProductRequest productRequest)
        {
            try
            {
                Product product = await _productRepository.GetProductByIdAsync(id);

                product.ProductName = productRequest.ProductName;
                product.Description = productRequest.Description;
                product.Quantity = productRequest.Quantity;
                product.Price = productRequest.Price;
                product.ManufacturerId = Guid.Parse(productRequest.ManufacturerId);
                product.CategoryId = Guid.Parse(productRequest.CategoryId);

                await _productRepository.UpdateProductAsync(product);
                
                return ApiResponse<ProductRequest>.Success(productRequest, "success");
            }
            catch (Exception)
            {
                return ApiResponse<ProductRequest>.Failure("Fail to update product ");
            }
        }
        public async Task<ApiResponse<Product>> DeleteProductAsync(string id)
        {
            try
            {
                Product product = await _productRepository.GetProductByIdAsync(id);

                product.DeletedAt = TimeHelper.GetVietnamTime();
                product.IsDeleted = true;

                await _productRepository.UpdateProductAsync(product);

                return ApiResponse<Product>.Success(product, "delete success");
            }
            catch (Exception)
            {
                return ApiResponse<Product>.Failure("Fail to delete product ");
            }
        }

        public async Task<ApiResponse<Product>> UpdateProToProductAsync(string id, string proId)
        {
            try
            {
                Product product = await _productRepository.GetProductByIdAsync(id);

                if (proId != null)
                {
                        product.PromotionId = Guid.Parse(proId);

                }

                await _productRepository.UpdateProductAsync(product);

                return ApiResponse<Product>.Success(product, "success");
            }
            catch (Exception)
            {
                return ApiResponse<Product>.Failure("Fail to update product ");
            }
        }
        public async Task<ApiResponse<Product>> DeletePromotionAsync(string id)
        {
            try
            {
                Product product = await _productRepository.GetProductByIdAsync(id);

                        product.PromotionId = null;
                

                await _productRepository.UpdateProductAsync(product);

                return ApiResponse<Product>.Success(product, "success");
            }
            catch (Exception)
            {
                return ApiResponse<Product>.Failure("Fail to delete promotion ");
            }
        }

        public async Task<ApiResponse<CartProduct>> AddProductToCartAsync(string userId, string productId, int amount)
        {
            var cart = await _accountRepository.GetCartByUserIdAsync(userId);
            var product = await _productRepository.GetProductByIdAsync(productId);

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            var existingCartProduct = cart.CartProducts
                .FirstOrDefault(cp => cp.ProductId == Guid.Parse(productId) && (cp.IsDeleted == null || cp.IsDeleted == false));

            if (existingCartProduct != null)
            {
                return ApiResponse<CartProduct>.Failure("Sản phẩm đã có trong giỏ hàng.");
            }

            var cartProduct = new CartProduct
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = Guid.Parse(productId),
                Amount = amount
            };

            await _cartService.RefreshCartTotalAmountAsync(userId);
            await _cartRepository.UpdateCartAsync(cart);

            var result = await _productRepository.AddProductToCartAsync(cartProduct);
            return ApiResponse<CartProduct>.Success(result, "success");
        }

    }
}
