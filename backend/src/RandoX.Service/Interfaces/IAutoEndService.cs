using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Service.Interfaces
{
    public interface IAutoEndService
    {
        Task HandleSessionExtensionAsync();
    }
}
