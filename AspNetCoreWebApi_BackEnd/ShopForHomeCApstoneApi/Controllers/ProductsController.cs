using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper.Configuration;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using CsvHelper.Configuration.Attributes;

namespace ShopForHomeCApstoneApi.Controllers
{
    public class ProductCsvModel
    {
        [Name("productName")]
        public string ProductName { get; set; }

        [Name("description")]
        public string Description { get; set; }

        [Name("price")]
        public decimal Price { get; set; }

        [Name("rating")]
        public double Rating { get; set; }

        [Name("stockQuantity")]
        public int StockQuantity { get; set; }

        [Name("categoryId")]
        public int CategoryId { get; set; }

        [Name("categoryName")]
        public string CategoryName { get; set; }

        [Name("imageUrl")]
        public string ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public ProductsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Products/GetAllProduct - Get all Product
        [HttpGet("GetAllProduct")]
        public async Task<ActionResult<object>> GetAllProduct()
        {
            //var catergories = await _context.Categories.ToListAsync();
            var products = await _context.Products.ToListAsync();

            if (products != null)
                return Ok(products);

            return NotFound(new {Message = $"No products left, you are out of stock !!!!!!" });
        }

        // GET: api/Products/5 - Get Single Product
        [HttpGet("GetProductById/{id}")]
        public async Task<ActionResult<object>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ProductId == id)
                .Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    p.Description,
                    p.Price,
                    p.Rating,
                    p.StockQuantity,
                    p.Category.CategoryName,
                    p.ImageUrl,
                    p.CreatedAt
                }).FirstOrDefaultAsync();

            if (product != null)
                return Ok(product);

            return NotFound(new {Message = $"Product with ID {id} not found." });
        }


        

        // POST: api/Products - Add Product (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpPost("AddProduct")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            
            if (_context.Products == null)
                return Problem("Entity set 'ShopForHomeDbContext.Products' is null.");

            if (await _context.Products.AnyAsync(p => p.ProductName == product.ProductName))
                return BadRequest(new {Message = "Product with this name already exists." });

            product.CreatedAt = DateTime.Now;
            var categories = _context.Categories.ToList();
            var categoryId = product.CategoryId;
            product.CategoryName = categories.Find(c => c.CategoryId == categoryId).CategoryName;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
        }

        // PUT: api/Products/5 - Update Product (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateProduct/{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
                return BadRequest(new {Message = "Product ID mismatch." });

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
                return NotFound(new { Message = $"Product with ID {id} not found." });

            existingProduct.ProductName = product.ProductName;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.ImageUrl = product.ImageUrl;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new {Message = "Product updated successfully." });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { Message = "Error updating product. Please try again." });
            }
        }

        // PATCH: api/Products/UpdateStock/5?quantity=50 - Update Stock Quantity (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpPatch("UpdateStock/{id}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int quantity)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { Message = $"Product with ID {id} not found." });

            product.StockQuantity = quantity;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new {Message = $"Stock updated for Product ID {id}. New quantity: {quantity}" });
            }
            catch
            {
                return StatusCode(500, new {Message = "Error updating stock."});
            }
        }


        // DELETE: api/Products/5 - Hard Delete Product (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound(new { Message = $"Product with ID {id} not found."});

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Product ID {id} deleted successfully." });
        }

        //Stock alert
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.StockAlerts
                .Where(n => !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/notifications/mark-read/{notificationId}")]
        public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
        {
            var notification = await _context.StockAlerts.FindAsync(notificationId);

            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            notification.IsRead = true;
            _context.StockAlerts.Update(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as read." });
        }

        // ✅ BULK UPLOAD: Upload CSV and Insert Products in Bulk (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpPost("BulkUpload")]
        public async Task<IActionResult> BulkUpload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "CSV file is required." });

            var products = new List<Product>();

            using (var stream = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(stream, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true, // Ensure CSV contains headers
                HeaderValidated = null, // Ignore missing headers validation
                MissingFieldFound = null // Ignore missing fields
            }))
            {
                try
                {
                    var records = csv.GetRecords<ProductCsvModel>().ToList(); // Use DTO for CSV processing

                    foreach (var record in records)
                    {
                        if (await _context.Products.AnyAsync(p => p.ProductName == record.ProductName))
                            continue; // Skip duplicates

                        var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == record.CategoryName);
                        if (category == null)
                            return BadRequest(new { Message = $"Category '{record.CategoryName}' not found." });

                        products.Add(new Product
                        {
                            ProductName = record.ProductName,
                            Description = record.Description,
                            Price = record.Price,
                            Rating = record.Rating,
                            StockQuantity = record.StockQuantity,
                            CategoryId = record.CategoryId, // Assign CategoryId dynamically
                            CategoryName = record.CategoryName,
                            ImageUrl = record.ImageUrl,
                            CreatedAt = DateTime.Now
                        });
                    }

                    if (products.Count == 0)
                        return BadRequest(new { Message = "No valid products found or all are duplicates." });

                    await _context.Products.AddRangeAsync(products);
                    await _context.SaveChangesAsync();

                    return Ok(new { Message = $"{products.Count} products uploaded successfully." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "Error processing CSV file.", Error = ex.Message });
                }
            }
        }

    }
}

