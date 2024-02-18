using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PrepaidCodeController : BaseApiController
    {
        private readonly StoreContext _context;

        public PrepaidCodeController(StoreContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("GeneratePrepaidCode")]
        public async Task<ActionResult<PrepaidCode>> GeneratePrepaidCode(long amount, string codeValue)
        {
            // Haszowanie kodu przy użyciu SHA256
            string hashedCode = HashCodeSHA256(codeValue);
             // Sprawdzenie, czy kod już istnieje w bazie danych
            if (_context.PrepaidCodes.Any(pc => pc.CodeValue == hashedCode))
            {
                return BadRequest("Code already exists");
            }

            var prepCode = new PrepaidCode
            {
                Amount = amount,
                CodeValue = hashedCode
            };

            if (hashedCode.Length == 64) // Długość hashu SHA256
            {
                _context.PrepaidCodes.Add(prepCode);

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(prepCode);
                }
                catch (DbUpdateException)
                {
                    return BadRequest("Failed to create code");
                }
            }

            return BadRequest("Invalid code length");
        }

        [Authorize]
        [HttpPost("UsePrepCode")]
        public async Task<ActionResult<object>> UsePrepCode(string codeWritten)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var prepCode = _context.PrepaidCodes.FirstOrDefault(x => x.CodeValue == HashCodeSHA256(codeWritten) && !x.IsUsed);

            if (prepCode != null)
            {
                user.AccountStatus += prepCode.Amount;
                prepCode.IsUsed = true;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { Success = true, Message = "Konto zostało doładowane pomyślnie.", AccountStatus = user.AccountStatus });
                }
                catch (DbUpdateException)
                {
                    return BadRequest(new { Success = false, Message = "Błąd podczas aktualizacji statusu konta." });
                }
            }

            return BadRequest(new { Success = false, Message = "Nieprawidłowy kod lub kod został już użyty." });
        }

        // Funkcja haszująca SHA256
        private string HashCodeSHA256(string codeValue)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeValue));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
