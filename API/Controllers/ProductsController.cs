using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using API.RequestHelp;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {

        private StoreContext _context { get; }
        private readonly UserManager<User> _userManager;

        public ProductsController(StoreContext context,UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;


        }

        [HttpGet]
        public async Task<ActionResult<PageList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products.sortProducts(productParams.orderBy)
            .searchProducts(productParams.searchWith)
            .filterProducts(productParams.categories,productParams.types)
            .AsQueryable();
            
            var products = await PageList<Product>.ToPagedList(query,productParams.PageNumber,productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);
           
            return products;
        }

        

        [HttpGet("{id}",Name ="Rate")]

        public async Task<ActionResult<Product>> GetProduct(int id)
        {

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var categories = await _context.Products.Select(p => p.Category).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok( new {categories,types});
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Product>> RateProduct(int id, int rate)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            // Sprawdź, czy użytkownik już ocenił ten produkt
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.ProductId == id && r.UserId == user.Id);

            if (existingRating != null)
            {
                // Użytkownik już ocenił ten produkt, zaktualizuj istniejącą ocenę
                existingRating.Quantity = rate;
            }
            else
            {
                // Dodaj nową ocenę do tabeli Ratings
                var newRating = new Rating
                {
                    ProductId = id,
                    UserId = user.Id,
                    Quantity = rate
                };

                _context.Ratings.Add(newRating);
            }

            try
            {
                await _context.SaveChangesAsync();

                // Odczekaj przed kontynuacją, aby dać czas na zakończenie operacji bazodanowej
                await Task.Delay(100);

                // Pobierz najnowsze informacje o produkcie po zapisie do bazy danych
                product = await _context.Products.FindAsync(id);

                // Oblicz nową średnią ocen
                var updatedRatings = await _context.Ratings
                    .Where(r => r.ProductId == id)
                    .Select(r => r.Quantity)
                    .ToListAsync();

                double updatedAverageRating = updatedRatings.Any() ? updatedRatings.Average() : 0;
                updatedAverageRating = Math.Round(updatedAverageRating, 2);

                int updatedAverageRatingInt = (int)updatedAverageRating;

                product.Rate = updatedAverageRatingInt;

                await _context.SaveChangesAsync();

                return Ok(product);
            }
            catch (DbUpdateException)
            {
                return BadRequest("Failed to update product rating.");
            }
        }








    }
}