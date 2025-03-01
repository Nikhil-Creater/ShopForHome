using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public SearchController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // Get All Categories
        [HttpGet("GetAllCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // Search & Filter Products
        [HttpGet("GetFilteredProducts")]
        public async Task<IActionResult> GetFilteredProducts(
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] double? minRating,
            [FromQuery] double? maxRating,
            [FromQuery] string? categoryName,
            [FromQuery] string? keyword
            )
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(p => p.ProductName.Contains(keyword));

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (minRating.HasValue)
                query = query.Where(p => p.Rating >= minRating.Value);

            if (maxRating.HasValue)
                query = query.Where(p => p.Rating <= maxRating.Value);

            if (categoryName != null)
                query = query.Where(p => p.CategoryName == categoryName);

            var products = await query.ToListAsync();

            if (products.Count == 0)
                return NotFound(new { message = "No products found matching the criteria." });

            return Ok(products);
        }
    }
}
