﻿using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(string orderId);
        Task<Order> CreateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetAllSuccessOrderAsync();
    }
}
