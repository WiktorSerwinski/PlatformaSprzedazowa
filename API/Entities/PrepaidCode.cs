using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class PrepaidCode
    {

    [Key]
    public int CodeId { get; set; }
    
    [Required]
    public string CodeValue { get; set; }
    public long Amount { get; set; }

    public bool IsUsed { get; set; } = false;
        
    }
}