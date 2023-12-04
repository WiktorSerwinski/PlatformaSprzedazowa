using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelp
{
    public class ProductParams : PaginationParams
    {
        public string orderBy  { get; set; }
        
        public string searchWith  { get; set; }
        
        public string  categories { get; set; }
        
        public string  types { get; set; }
        
    }

    

}