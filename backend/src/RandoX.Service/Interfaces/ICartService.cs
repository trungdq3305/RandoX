using RandoX.Common;
using RandoX.Data.Entities;
using RandoX.Data.Models;
using RandoX.Data.Models.CartModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface ICartService
    {
        Task<ApiResponse<CartProduct>> UpdateCartProductAmountAsync(string id, int amount, string cartId);
        Task<ApiResponse<CartResponse>> GetAllInCartAsync(int pageNumber, int pageSize, string cartId);
        Task<ApiResponse<decimal>> RefreshCartTotalAmountAsync(string cartId);
    }
}
