using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandoX.Common;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Service.Interfaces;

namespace RandoX.API.Controllers
{
    public class ImageController : BaseAPIController
    {
        private readonly BlobService _blobService;
        private readonly randox_dbContext _context;

        public ImageController(BlobService blobService, randox_dbContext context)
        {
            _blobService = blobService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile image, [FromQuery] Guid? orderId, [FromQuery] Guid? productId)
        {
            if (image == null || image.Length == 0)
                return BadRequest("Image is required");

            // ✅ Chỉ 1 trong 2 được truyền
            if ((orderId == null && productId == null) || (orderId != null && productId != null))
                return BadRequest("Please provide either OrderId or ProductId, but not both.");

            // ✅ Kiểm tra xem đã có ảnh gắn productId/orderId chưa
            bool imageExists = false;

            if (orderId.HasValue)
            {
                imageExists = await _context.Images.AnyAsync(i => i.OrderId == orderId && i.IsDeleted != true);
            }
            else if (productId.HasValue)
            {
                imageExists = await _context.Images.AnyAsync(i => i.ProductId == productId && i.IsDeleted != true);
            }

            if (imageExists)
            {
                return Conflict("An image already exists for the provided OrderId or ProductId.");
            }

            var imageUrl = await _blobService.UploadImageAsync(image);

            var newImage = new Image
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                ProductId = productId,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.Now,
                IsDeleted = false
            };

            _context.Images.Add(newImage);
            await _context.SaveChangesAsync();

            return Ok(newImage);
        }

        [HttpGet("by-id")]
        public async Task<IActionResult> GetImageById([FromQuery] Guid? orderId, [FromQuery] Guid? productId)
        {
            // ✅ Chỉ cho phép truyền đúng 1 trong 2
            if ((orderId == null && productId == null) || (orderId != null && productId != null))
                return BadRequest("Please provide either OrderId or ProductId, but not both.");

            Image image = null;

            if (orderId.HasValue)
            {
                image = await _context.Images
                    .Where(i => i.OrderId == orderId && i.IsDeleted != true)
                    .FirstOrDefaultAsync();
            }
            else if (productId.HasValue)
            {
                image = await _context.Images
                    .Where(i => i.ProductId == productId && i.IsDeleted != true)
                    .FirstOrDefaultAsync();
            }

            if (image == null)
                return NotFound("No image found for the provided ID.");

            return Ok(image);
        }

    }
}
