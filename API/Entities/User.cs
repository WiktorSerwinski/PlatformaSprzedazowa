
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public long AccountStatus { get; set; } = 500000;
    }
}