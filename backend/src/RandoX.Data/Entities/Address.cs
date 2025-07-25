﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace RandoX.Data.Entities;

public partial class Address
{
    public Guid Id { get; set; }

    public string FullAddress { get; set; }

    public string PhoneNumber { get; set; }

    public string RecipientName { get; set; }

    public bool? IsDefault { get; set; }

    public Guid? AccountId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual Account Account { get; set; }
}