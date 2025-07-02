using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Data.Models.AccountModel
{
    public class UpdateAccountDto
    {
        public string PhoneNumber { get; set; }
        public DateOnly Dob { get; set; }
        public int? Status { get; set; }
        public Guid? RoleId { get; set; }
    }

}
