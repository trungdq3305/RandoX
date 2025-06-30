using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Models;
using RandoX.Data.Models.ProductModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<PaginationResult<ProductDetailDto>>> GetAllProductsAsync(int pageNumber, int pageSize);
        Task<ApiResponse<ProductDetailDto>> GetProductByIdAsync(string id);
        Task<ApiResponse<ProductRequest>> CreateProductAsync(ProductRequest productRequest);
        Task<ApiResponse<ProductRequest>> UpdateProductAsync(string id, ProductRequest productRequest);
        Task<ApiResponse<Product>> DeleteProductAsync(string id);
        Task<ApiResponse<Product>> UpdateProToProductAsync(string id, string proId);
        Task<ApiResponse<Product>> DeletePromotionAsync(string id);
        Task<ApiResponse<CartProduct>> AddProductToCartAsync(string userId, string productId, int amount);
    }
}
