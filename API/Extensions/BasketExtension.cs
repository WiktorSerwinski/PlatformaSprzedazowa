using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtension
    {
        
        public static BasketDto MapBasketToDto(this  Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(i => new BasketItemDto
                {
                    ProductId = i.ProductId,
                    Name = i.Product.Name,
                    Price = i.Product.Price,
                    PictureURL = i.Product.PictureUrl,
                    Category = i.Product.Category,
                    Type = i.Product.Type,
                    Quantity = i.Quantity,
                    Rate = i.Product.Rate
                }).ToList()
            };
        }
        public static IQueryable<Basket> GetBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(item=> item.Items).ThenInclude(product => product.Product).Where(b=>b.BuyerId == buyerId);

        }




    }
}