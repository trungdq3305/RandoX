﻿using RandoX.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.CartModel
{
    public class CartResponse
    {
        public Guid Id { get; set; }
        public IEnumerable<CartProductDto> CartProducts { get; set; }
    }
}
