using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    [Authorize(Roles = "Admin")]
    
    [ApiController]
    [Route("api/category")]
    public class CategoriesController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public CategoriesController(ShopForHomeDbContext context)
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

        // Get Category by ID
        [HttpGet("GetCategory/{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found." });
            }
                

            return Ok(category);
        }

        // Create a New Category
        [HttpPost("CreateCategory")]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            if (string.IsNullOrWhiteSpace(category.CategoryName))
            {
                return BadRequest(new { message = "Category name is required." });
            }
                

            bool categoryExists = await _context.Categories
                .AnyAsync(c => c.CategoryName == category.CategoryName);

            if (categoryExists)
                return Conflict(new { message = "Category already exists." });

            category.CreatedAt = DateTime.Now;
            category.UpdatedAt = null; // Set UpdatedAt to null initially

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);
        }

        // Update Category
        [HttpPut("UpdateCategory/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category updatedCategory)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found." });

            if (string.IsNullOrWhiteSpace(updatedCategory.CategoryName))
                return BadRequest(new { message = "Category name is required." });

            category.CategoryName = updatedCategory.CategoryName;
            category.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Category updated successfully." });
        }

        // Delete Category (Hard Delete)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found." });

            _context.Categories.Remove(category); // Hard delete
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully." });
        }
    }
}
