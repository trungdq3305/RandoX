﻿using Microsoft.Extensions.DependencyInjection;
using RandoX.Data.Interfaces;
using RandoX.Service.Interfaces;
using RandoX.Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddService(this IServiceCollection service)
        {
            service.AddTransient<IProductService, ProductService>();
            service.AddTransient<IAccountService, AccountService>();
            service.AddTransient<IImageService, ImageService>();
            service.AddTransient<IOrderService, OrderService>();
            service.AddTransient<ITransactionService, TransactionService>();
            service.AddTransient<IEmailService, EmailService>();
            service.AddTransient<IManufacturerService, ManufacturerService>();
            service.AddTransient<ICategoryService, CategoryService>();
            service.AddTransient<IProductService, ProductService>();
            service.AddTransient<IProductSetService, ProductSetService>();
            service.AddTransient<ICartService, CartService>();
            service.AddTransient<IVoucherService, VoucherService>();
            service.AddTransient<IOrderService, OrderService>();
            service.AddTransient<IPromotionService, PromotionService>();
            service.AddTransient<IWalletService, WalletService>();
            service.AddTransient<ISpinWheelService, SpinWheelService>();
            service.AddTransient<IDashboardService, DashboardService>();
            service.AddTransient<IAuctionItemService, AuctionItemService>();
            service.AddTransient<IAuctionBidService, AuctionBidService>();
            service.AddTransient<IAutoEndService, AutoEndService>();
            return service;
        }
    }
}
