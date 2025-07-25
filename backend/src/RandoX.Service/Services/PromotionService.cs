﻿using RandoX.Common;
using RandoX.Data;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using RandoX.Data.Models;
using RandoX.Data.Models.PromotionModel;
using RandoX.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _promotionRepository;

        public PromotionService(IPromotionRepository promotionRepository)
        {
            _promotionRepository = promotionRepository;
        }

        public async Task<ApiResponse<PaginationResult<Promotion>>> GetAllPromotionsAsync(int pageNumber, int pageSize)
        {
            try
            {
                var promotions = await _promotionRepository.GetAllPromotionsAsync();
                var paginatedResult = new PaginationResult<Promotion>(promotions.ToList(), promotions.Count(), pageNumber, pageSize);

                return ApiResponse<PaginationResult<Promotion>>.Success(paginatedResult, "success");
            }
            catch (Exception)
            {
                return ApiResponse<PaginationResult<Promotion>>.Failure("Fail to get promotions");
            }
        }

        public async Task<ApiResponse<Promotion>> GetPromotionByIdAsync(string id)
        {
            try
            {
                var promotion = await _promotionRepository.GetPromotionByIdAsync(id);
                return ApiResponse<Promotion>.Success(promotion, "success");
            }
            catch (Exception)
            {
                return ApiResponse<Promotion>.Failure("Fail to get promotion");
            }
        }

        public async Task<ApiResponse<Promotion>> CreatePromotionAsync(PromotionRequest promotionRequest)
        {
            try
            {
                Promotion promotion = new Promotion
                {
                    Id = Guid.NewGuid(),
                    Event = promotionRequest.Event,
                    StartDate = promotionRequest.StartDate,
                    EndDate = promotionRequest.EndDate,
                    PercentageDiscountValue = promotionRequest.PercentageDiscountValue,
                    DiscountValue = promotionRequest.DiscountValue
                };

                await _promotionRepository.CreatePromotionAsync(promotion);

                return ApiResponse<Promotion>.Success(promotion, "Promotion created successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Promotion>.Failure("Fail to create promotion");
            }
        }

        public async Task<ApiResponse<Promotion>> UpdatePromotionAsync(string id, PromotionRequest promotionRequest)
        {
            try
            {
                var promotion = await _promotionRepository.GetPromotionByIdAsync(id);
                if (promotion == null)
                {
                    return ApiResponse<Promotion>.Failure("Promotion not found");
                }

                promotion.Event = promotionRequest.Event;
                promotion.StartDate = promotionRequest.StartDate;
                promotion.EndDate = promotionRequest.EndDate;
                promotion.PercentageDiscountValue = promotionRequest.PercentageDiscountValue;
                promotion.DiscountValue = promotionRequest.DiscountValue;

                await _promotionRepository.UpdatePromotionAsync(promotion);

                return ApiResponse<Promotion>.Success(promotion, "Promotion updated successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Promotion>.Failure("Fail to update promotion");
            }
        }

        public async Task<ApiResponse<Promotion>> DeletePromotionAsync(string id)
        {
            try
            {
                var pro = await _promotionRepository.GetPromotionByIdAsync(id);
                pro.DeletedAt  = TimeHelper.GetVietnamTime();
                pro.IsDeleted = true;
                await _promotionRepository.UpdatePromotionAsync(pro);
                return ApiResponse<Promotion>.Success(pro, "Promotion delete successfully");
            }
            catch (Exception)
            {
                return ApiResponse<Promotion>.Failure("Fail to delete promotion");
            }
        }
    }

}
