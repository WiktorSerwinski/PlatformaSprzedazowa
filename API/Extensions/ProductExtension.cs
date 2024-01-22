using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtension
    {
        public static IQueryable<Product> sortProducts(this IQueryable<Product> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
            {
                "lowPrice" => query.OrderBy(p => p.Price),
                "highPrice" => query.OrderByDescending(p => p.Price),
                "rate" => query.OrderByDescending(p=> p.Rate),                
                _ => query.OrderBy(p => p.Name)

            };
            return query;
        }
        public static IQueryable<Product> searchProducts(this IQueryable<Product> query, string search)
        {
            if (string.IsNullOrWhiteSpace(search)) return query;

            var lowerSearch = search.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerSearch));

        }


        public static IQueryable<Product> filterProducts(this IQueryable<Product> query, string categories, string types)
        {
            var categoryList = new List<string>();
            
            var typeList = new List<string>();

            if(!string.IsNullOrEmpty(categories))
                categoryList.AddRange(categories.ToLower().Split(",").ToList());

            if(!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(p=> categoryList.Count == 0 || categoryList.Contains(p.Category.ToLower()));
            query = query.Where(p=> typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return query;
        }




    }
}