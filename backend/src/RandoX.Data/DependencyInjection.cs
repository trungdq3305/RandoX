﻿using Microsoft.Extensions.DependencyInjection;
using RandoX.Data.Bases;
using RandoX.Data.Interfaces;
using RandoX.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepository(this IServiceCollection service)
        {
            service.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
            service.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            service.AddTransient<IProductRepository, ProductRepository>();
            service.AddTransient<IAccountRepository, AccountRepository>();
            service.AddTransient<IImageRepository, ImageRepository>();
            service.AddTransient<IVoucherRepository, VoucherRepository>();
            service.AddTransient<IOrderRepository, OrderRepository>();
            service.AddTransient<ITransactionRepository, TransactionRepository>();
            service.AddTransient<IEmailTokenRepository, EmailTokenRepository>();
            service.AddTransient<IManufacturerRepository, ManufacturerRepository>();
            service.AddTransient<ICategoryRepository, CategoryRepository>();
            service.AddTransient<IPromotionRepository, PromotionRepository>();
            service.AddTransient<IProductSetRepository, ProductSetRepository>();
            service.AddTransient<ICartRepository, CartRepository>();
            service.AddTransient<IWalletRepository, WalletRepository>();
            service.AddTransient<ISpinWheelRepository, SpinWheelRepository>();
            service.AddTransient<IDashboardRepository, DashboardRepository>();
            service.AddTransient<IAuctionRepository, AuctionRepository>();
            service.AddTransient<IAuctionBidRepository, AuctionBidRepository>();
            service.AddTransient<IAuctionSessionRepository, AuctionSessionRepository>();
            return service;
        }
    }
}
