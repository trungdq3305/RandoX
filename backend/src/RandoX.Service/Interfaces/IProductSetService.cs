﻿using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Models;
using RandoX.Data.Models.ProductSetModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IProductSetService
    {
        Task<ApiResponse<PaginationResult<ProductSetDetailDto>>> GetAllProductSetsAsync(int pageNumber, int pageSize);
        Task<ApiResponse<ProductSetDetailDto>> GetProductSetByIdAsync(string id);
        Task<ApiResponse<ProductSet>> CreateProductSetAsync(ProductSetRequest productSetRequest);
        Task<ApiResponse<ProductSet>> UpdateProductSetAsync(string id, ProductSetRequest productSetRequest);
        Task<ApiResponse<ProductSet>> DeleteProductSetAsync(string id);
        Task<ApiResponse<ProductSet>> UpdateProToProductSetAsync(string id, string proId);
        Task<ApiResponse<ProductSet>> DeletePromotionAsync(string id);
        Task<ApiResponse<CartProduct>> AddSetToCartAsync(string userId, string setId, int amount);
    }

}
