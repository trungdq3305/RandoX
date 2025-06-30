using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface ICartRepository
    {
        Task<CartProduct> UpdateCartProductAsync(CartProduct cart);
        Task<Cart> UpdateCartAsync(Cart cart);
        Task<CartProduct> GetCartProductByIdAsync(string id);
        Task<IEnumerable<CartProduct>> GetAllInCartAsync(string cartId);
        Task UpdateCartProductsAsync(IEnumerable<CartProduct> cartProducts);
    }
}
