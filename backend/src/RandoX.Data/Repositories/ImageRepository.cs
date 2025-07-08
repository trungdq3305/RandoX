using Microsoft.EntityFrameworkCore;
using RandoX.Data.Bases;
using RandoX.Data.DBContext;
using RandoX.Data.Entities;
using RandoX.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Repositories
{
    public class ImageRepository : Repository<Image>, IImageRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;
        public ImageRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }

        public async Task<Image> AddImageAsync(Image image)
        {
            Entities.Add(image);
            await _uow.SaveChangesAsync();
            return image;
        }
        public async Task<Image> GetImagesByProductIdAsync(Guid productId)
        {
            return await Entities.FirstOrDefaultAsync(i => i.ProductId == productId && i.IsDeleted == false);
        }
        public async Task<Image> GetImagesByOrderIdAsync(Guid orderId)
        {
            return await Entities.FirstOrDefaultAsync(i => i.OrderId == orderId && i.IsDeleted == false);
        }
    }
}
