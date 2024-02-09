
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        
        public AddressUser Address { get; set; }
        public long AccountStatus { get; set; } = 500000;

    }
}