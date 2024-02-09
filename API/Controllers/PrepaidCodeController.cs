using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PrepaidCodeController : BaseApiController
    {
        
        private readonly StoreContext _context;
        public PrepaidCodeController (StoreContext context)
        {
            _context = context;              
        }

       [Authorize(Roles = "Admin")]
       [HttpPost("GeneratePrepaidCode")]     
        public async Task<ActionResult<PrepaidCode>>GeneratePrepaidCode(long amount,string codeValue)
        {

            var prepCode =   new PrepaidCode{
                Amount = amount,
                CodeValue = codeValue
             };
             
            if(codeValue.Length==6){
             _context.PrepaidCodes.Add(prepCode);
               try
            {
                await _context.SaveChangesAsync();
                return Ok(prepCode);
            }
            catch (DbUpdateException)
            {
                return BadRequest("Failed to Create Code");
            }
            }
            return BadRequest("Invalid code length");

        }

        [Authorize]
        [HttpPost("UsePrepCode")]     
        public async Task<ActionResult<object>> UsePrepCode(string codeWritten)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var prepCode = _context.PrepaidCodes.FirstOrDefault(x => x.CodeValue == codeWritten);

            if (prepCode != null && prepCode.IsUsed == false)
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



    }
}