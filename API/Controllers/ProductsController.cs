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

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {

        private StoreContext _context { get; }

        public ProductsController(StoreContext context)
        {
            _context = context;


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


        [HttpGet("{id}")]

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





    }
}