using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController (UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;                    
        }
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
            }
            
            
            return await _context.Baskets
                    .Include(i => i.Items)
                    .ThenInclude(p => p.Product)
                    .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.UserName);
            var unauthoriseBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
            if(unauthoriseBasket != null)
            {
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                unauthoriseBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                AccountStatus = user.AccountStatus,
                Basket = unauthoriseBasket != null ? unauthoriseBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
                
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {UserName = registerDto.UserName,
             Email = registerDto.Email,            
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if(!result.Succeeded)
            {
                foreach ( var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code,error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user,"Member");

            return StatusCode(201);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task <ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var basketUser = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                AccountStatus = user.AccountStatus,
                Basket = basketUser?.MapBasketToDto()
            };

        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task <ActionResult<AddressUser>> GetUserSavedAddres()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user=> user.Address)
                .FirstOrDefaultAsync();
        }

        [Authorize(Roles = "Admin")] 
        [HttpDelete("removeUserByEmail/{email}")]
        public async Task<ActionResult> RemoveUserByEmail(string email)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    return NotFound($"Nie znaleziono użytkownika o adresie e-mail: {email}");
                }

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return ValidationProblem();
                }

                return Ok($"Użytkownik o adresie e-mail {email} został pomyślnie usunięty.");
            }
            catch (Exception ex)
            {
                // Obsługa błędów, logowanie itp.
                return StatusCode(500, $"Wystąpił błąd podczas usuwania użytkownika: {ex.Message}");
            }
        }     
    }
}