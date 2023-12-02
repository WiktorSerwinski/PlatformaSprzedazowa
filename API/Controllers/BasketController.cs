using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public StoreContext Context { get; }

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet (Name ="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }

      
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int product_id, int quantity)
        {
            var basket = await RetrieveBasket();

            if (basket == null) basket = CreateBasket();

            var product = await _context.Products.FindAsync(product_id);

            if (product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket",MapBasketToDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving to basket" });

        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(1000) };
            Response.Cookies.Append("buyerId", buyerId);
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }

        [HttpDelete]

        public async Task<ActionResult>RemoveBasketItem(int product_id,int quantity)
        {
            Basket basket = await RetrieveBasket();
            if (basket == null) return NotFound();
             
            var product = await _context.Products.FindAsync(product_id);

            if (product == null) return NotFound();

            basket.RemoveItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return StatusCode(201);

            return BadRequest(new ProblemDetails { Title = "Problem removing from basket" });

        }


        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                    .Include(i => i.Items)
                    .ThenInclude(p => p.Product)
                    .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

          private BasketDto MapBasketToDto(Basket basket)
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
                    Quantity = i.Quantity
                }).ToList()
            };
        }


    }
}