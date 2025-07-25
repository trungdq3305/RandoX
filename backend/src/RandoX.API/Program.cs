﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RandoX.API;
using RandoX.API.Hubs;
using RandoX.API.Services;
using RandoX.Common;
using RandoX.Data;
using RandoX.Data.DBContext;
using RandoX.Data.Models.EmailModel;
using RandoX.Service;
using RandoX.Service.Background;
using RandoX.Service.Interfaces;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<randox_dbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services
.AddRepository()
.AddService();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
// Add services to the container.
builder.WebHost.UseUrls("http://0.0.0.0:5000");

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            // ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddSwaggerGen(option =>
{
    ////JWT Config
    option.DescribeAllParametersInCamelCase();
    option.ResolveConflictingActions(conf => conf.First());     // duplicate API name if any, ex: Get() & Get(string id)
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});
builder.Services.AddSingleton<BlobService>();

builder.Services.AddSingleton<S3Service>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new S3Service(config);
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "https://randoxfe.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});
// VNPay Configuration
builder.Services.Configure<VNPayConfig>(builder.Configuration.GetSection("VNPay"));
builder.Services.AddScoped<IVNPayService, VNPayService>();
builder.Services.AddScoped<IAuctionHubService, AuctionHubService>();
builder.Services.AddHostedService<AutoEndAuctionService>();
builder.Services.AddSignalR();
// Logging
builder.Services.AddLogging();

var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI();

app.MapHub<AuctionHub>("/hubs/auction");
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
