﻿using Microsoft.EntityFrameworkCore;
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
    public class ProductSetRepository : Repository<ProductSet>, IProductSetRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;

        public ProductSetRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }

        public async Task<IEnumerable<ProductSet>> GetAllProductSetsAsync()
        {
            return await Entities.Where(a => a.IsDeleted != true)
                .Include(x => x.Promotion).Include(x => x.Product).ToListAsync();
        }

        public async Task<ProductSet> GetProductSetByIdAsync(string id)
        {
            return await Entities.Where(a => a.IsDeleted != true).Include(x => x.Promotion).Include(x => x.Product).FirstOrDefaultAsync(ps => ps.Id == Guid.Parse(id));
        }

        public async Task<ProductSet> CreateProductSetAsync(ProductSet productSet)
        {
            Entities.Add(productSet);
            await _uow.SaveChangesAsync();
            return productSet;
        }

        public async Task<ProductSet> UpdateProductSetAsync(ProductSet productSet)
        {
            Entities.Update(productSet);
            await _uow.SaveChangesAsync();
            return productSet;
        }

        public async Task<ProductSet> DeleteProductSetAsync(string id)
        {
            var productSet = await GetProductSetByIdAsync(id);
            if (productSet != null)
            {
                productSet.DeletedAt = TimeHelper.GetVietnamTime();
                productSet.IsDeleted = true; // Mark as deleted
                await _uow.SaveChangesAsync();
            }
            return productSet;
        }
        public async Task<CartProduct> AddSetToCartAsync(CartProduct cartProduct)
        {
            _context.CartProducts.Add(cartProduct);
            await _uow.SaveChangesAsync();
            return cartProduct;
        }
    }

}
