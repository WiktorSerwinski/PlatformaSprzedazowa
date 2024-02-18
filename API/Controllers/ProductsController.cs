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
using API.DTOs;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {

        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;


        private readonly ImageService _imageService;

        public ProductsController(StoreContext context,UserManager<User> userManager, ImageService imageService)
        {
            _imageService = imageService;
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

        [HttpGet("AllProducts")]
        public async Task<ActionResult<List <Product>>> AllProducts()
        {
            return await  _context.Products.ToListAsync();
        }

        

        [HttpGet("{id}",Name ="GetProduct")]

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
        [HttpPost("RateProduct")]
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

                
                await Task.Delay(100);

                
                product = await _context.Products.FindAsync(id);

                
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

        [Authorize(Roles ="Admin")]
        [HttpPost("CreateProduct")]
        public async Task<ActionResult<Product>> CreateNewProduct([FromForm]ProductDto productdto)
        {
            var product = new Product{
                Category = productdto.Category,
                Description = productdto.Description,
                Name = productdto.Name,
                Type = productdto.Type,
                Rate = 0,
                Price = productdto.Price,
                QuantityInStock = productdto.QuantityInStock,        
            };
            if(productdto.Picture != null)
            {
                var imageResult = await _imageService.AddImage(productdto.Picture);
                if(imageResult.Error != null)
                {
                    return BadRequest();
                }
                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.CloudId = imageResult.PublicId;
            }
            
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;
            if(result) return CreatedAtRoute("GetProduct",new {Id = product.Id},product);
            return BadRequest(new ProblemDetails{Title="Failed to create product"});

        }

        [Authorize(Roles ="Admin")]
        [HttpPut("EditProduct")]
        public async Task<ActionResult<Product>> EditProduct([FromForm]ProductDto productdto, int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product ==  null) return NotFound();                 
            product.Category = productdto.Category;
            product.Description = productdto.Description;
            product.Name = productdto.Name;
            product.Type = productdto.Type;
            product.Price = productdto.Price;
            product.QuantityInStock = productdto.QuantityInStock;
            if(productdto.Picture != null)
            {
                var imageResult = await _imageService.AddImage(productdto.Picture);
                if(imageResult.Error != null)
                {
                    return BadRequest();
                }
                if(!string.IsNullOrEmpty(product.CloudId))
                    await _imageService.DeleteImage(product.CloudId);   
                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.CloudId = imageResult.PublicId;
            }                 
            var result = await _context.SaveChangesAsync() > 0;
            if(result) return Ok(product);
             return BadRequest("Failed to update product");
        }

        
        [Authorize(Roles ="Admin")]
        [HttpDelete("DeleteProduct")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product ==  null) return NotFound(); 
            if(!string.IsNullOrEmpty(product.CloudId))
                await _imageService.DeleteImage(product.CloudId);    
            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync() >0;
             if(result) return Ok();
             return BadRequest("Failed to delete product");

        }




    }
}