using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.RequestHelp;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
            
            response.Headers.Add("Pagination",JsonSerializer.Serialize(metaData,options));
            response.Headers.Append("Access-Control-Expose-Headers","Pagination");
        }
        
    }
}