﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace RandoX.Data.Entities;

public partial class WalletHistory
{
    public Guid Id { get; set; }

    public DateOnly TimeTransaction { get; set; }

    public decimal Amount { get; set; }

    public Guid? AccountId { get; set; }

    public Guid? TransactionTypeId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual Account Account { get; set; }

    public virtual TransactionType TransactionType { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}