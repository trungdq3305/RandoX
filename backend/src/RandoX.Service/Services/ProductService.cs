﻿using Microsoft.EntityFrameworkCore;
using RandoX.Common;
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
        public ProductService(IProductRepository productRepository, IAccountRepository accountRepository, ICartRepository cartRepository, ICartService cartService)
        {
            _productRepository = productRepository;
            _accountRepository = accountRepository;
            _cartRepository = cartRepository;
            _cartService = cartService;
        }
        public async Task<ApiResponse<PaginationResult<Product>>> GetAllProductsAsync(int pageNumber, int pageSize)
        {
            try
            {
                var products = await _productRepository.GetAllProductsAsync();

                var paginatedResult = new PaginationResult<Product>(products.ToList(), products.Count(), pageNumber, pageSize);

                return ApiResponse<PaginationResult<Product>>.Success(paginatedResult, "success");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<Product>>.Failure("Fail to get all product ");
            }
        }
        public async Task<ApiResponse<Product>> GetProductByIdAsync(string id)
        {
            try
            {
                var products = await _productRepository.GetProductByIdAsync(id);
                return ApiResponse<Product>.Success(products, "success");
            }
            catch (Exception)
            {
                return ApiResponse<Product>.Failure("Fail to get product ");
            }
        }
        public async Task<ApiResponse<ProductRequest>> CreateProductAsync(ProductRequest productRequest)
        {
            try
            {
                Product product = new Product
                {
                    Id = Guid.NewGuid(),
                    ProductName = productRequest.ProductName,
                    Description = productRequest.Description,
                    Quantity = productRequest.Quantity,
                    Price = productRequest.Price,
                    ManufacturerId = Guid.Parse(productRequest.ManufacturerId),
                    CategoryId = Guid.Parse(productRequest.CategoryId),
                };
                
                await _productRepository.CreateProductAsync(product);

                return ApiResponse<ProductRequest>.Success(productRequest, "success");
            }
            catch (Exception)
            {
                return ApiResponse<ProductRequest>.Failure("Fail to create product ");
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

                product.DeletedAt = DateTime.Now;
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

        public async Task<ApiResponse<CartProduct>> AddProductToCartAsync(string userId, string productId)
        {
            var cart = await _accountRepository.GetCartByUserIdAsync(userId);
            var product = await _productRepository.GetProductByIdAsync(productId);
            var cartProduct = new CartProduct
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = Guid.Parse(productId)
            };
            await _cartService.RefreshCartTotalAmountAsync(userId);

            await _cartRepository.UpdateCartAsync(cart);

            var a = await _productRepository.AddProductToCartAsync(cartProduct);
            return ApiResponse<CartProduct>.Success(a, "success");
        }
    }
}
