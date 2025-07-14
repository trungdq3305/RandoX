using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.AccountModel
{
    public class AccountSummaryDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public DateOnly Dob { get; set; }
        public string PhoneNumber { get; set; }
        public int? Status { get; set; }
        public Guid? RoleId { get; set; }
        public string RoleName { get; set; }
        public string FullName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
