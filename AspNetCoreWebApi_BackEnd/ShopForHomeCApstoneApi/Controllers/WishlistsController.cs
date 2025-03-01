using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public WishlistController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // USER: ADD PRODUCT TO WISHLIST
        [Authorize(Roles = "User")]
        [HttpPost("AddToWishlist")]
        public async Task<IActionResult> AddToWishlist([FromBody] Wishlist wishlistItem)
        {
            if (wishlistItem == null || wishlistItem.ProductId <= 0)
                return BadRequest(new { message = "Invalid wishlist details." });

            // Extract the userId from the token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Ensure the userId from the token matches the one in the body of the request
            if (userId != wishlistItem.UserId)
                return Unauthorized(new { message = "You can only modify your own wishlist." });

            var product = await _context.Products.FindAsync(wishlistItem.ProductId);
            var user = await _context.Users.FindAsync(userId);

            if (product == null || user == null)
                return NotFound(new { message = "Product or User not found." });

            // Prevent adding out-of-stock products to the wishlist
            if (product.StockQuantity <= 0)
            {
                return BadRequest(new { message = "This product is out of stock and cannot be added to your wishlist." });
            }

            var existingItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == wishlistItem.ProductId);

            if (existingItem != null)
                return BadRequest(new { message = "Product is already in your wishlist." });

            wishlistItem.CreatedAt = DateTime.Now;
            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product added to wishlist successfully!", wishlistId = wishlistItem.WishlistId });
        }

        // USER: GET WISHLIST ITEMS FOR LOGGED-IN USER
        [Authorize(Roles = "User")]
        [HttpGet("GetWishlist")]
        public async Task<IActionResult> GetWishlist()
        {
            // Extract the userId from the token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var wishlistItems = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .ToListAsync();

            if (!wishlistItems.Any())
                return NotFound(new { message = "Your wishlist is empty." });

            return Ok(wishlistItems);
        }

        // USER: REMOVE PRODUCT FROM WISHLIST
        [Authorize(Roles = "User")]
        [HttpDelete("RemoveFromWishlist/{wishlistId}")]
        public async Task<IActionResult> RemoveFromWishlist(int wishlistId)
        {
            // Extract the userId from the token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var wishlistItem = await _context.Wishlists.FindAsync(wishlistId);
            if (wishlistItem == null)
                return NotFound(new { message = "Wishlist item not found." });

            // Check if the logged-in user owns the wishlist item
            if (wishlistItem.UserId != userId)
                return Unauthorized(new { message = "You can only remove items from your own wishlist." });

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product removed from wishlist successfully!" });
        }

        // USER: CLEAR ENTIRE WISHLIST
        [Authorize(Roles = "User")]
        [HttpDelete("ClearWishlist")]
        public async Task<IActionResult> ClearWishlist()
        {
            // Extract the userId from the token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var wishlistItems = _context.Wishlists.Where(w => w.UserId == userId);
            if (!wishlistItems.Any())
                return NotFound(new { message = "Your wishlist is already empty." });

            _context.Wishlists.RemoveRange(wishlistItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Wishlist cleared successfully!" });
        }
    }
}
