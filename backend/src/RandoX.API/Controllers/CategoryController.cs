﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RandoX.Data.Entities;
using RandoX.Data.Models.Category;
using RandoX.Service.Interfaces;

namespace RandoX.API.Controllers
{
    
    public class CategoryController : BaseAPIController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories(int pageNumber, int pageSize)
        {
            var response = await _categoryService.GetAllCategoriesAsync(pageNumber, pageSize);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            var response = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest categoryRequest)
        {
            var response = await _categoryService.CreateCategoryAsync(categoryRequest);
            return Ok(response);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryRequest categoryRequest)
        {
            var response = await _categoryService.UpdateCategoryAsync(id, categoryRequest);
            return Ok(response);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var response = await _categoryService.DeleteCategoryAsync(id);
            return Ok(response);
        }
    }

}
