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
    public class CartRepository : Repository<Cart>, ICartRepository
    {
        private readonly randox_dbContext _context;
        private readonly IUnitOfWork _uow;
        public CartRepository(randox_dbContext context, IUnitOfWork uow) : base(context)
        {
            _context = context;
            _uow = uow;
        }

        public async Task<CartProduct> UpdateCartProductAsync(CartProduct cart)
        {
            _context.CartProducts.Update(cart);
            await _uow.SaveChangesAsync();
            return cart;
        }
        public async Task<Cart> UpdateCartAsync(Cart cart)
        {
            Entities.Update(cart);
            await _uow.SaveChangesAsync();
            return cart;
        }
        public async Task<CartProduct> GetCartProductByIdAsync(string id)
        {
            return await _context.CartProducts.Where(a => a.IsDeleted != true).FirstOrDefaultAsync(c => c.Id == Guid.Parse(id));
        }
        public async Task<IEnumerable<CartProduct>> GetAllInCartAsync(string cartId)
        {
            return await _context.CartProducts.Include(a => a.Product).ThenInclude(a => a.Promotion).Include(a => a.ProductSet).ThenInclude(a => a.Promotion).Where(a => a.IsDeleted != true && a.CartId == Guid.Parse(cartId)).ToListAsync();
        }
        public async Task UpdateCartProductsAsync(IEnumerable<CartProduct> cartProducts)
        {
            _context.CartProducts.UpdateRange(cartProducts);
            await _context.SaveChangesAsync();
        }
    }
}
