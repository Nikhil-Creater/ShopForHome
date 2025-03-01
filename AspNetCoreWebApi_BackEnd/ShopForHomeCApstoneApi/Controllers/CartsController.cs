using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using ShopForHomeCApstoneApi.Models;

namespace ShopForHomeCApstoneApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    
    [ApiController]
    [Route("api/cart")]
    [Authorize (Roles = "User")]
    public class CartsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public CartsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // Get Logged-in User ID so that user can add products to his cart only
        private int GetLoggedInUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // Add Product to Cart
        [HttpPost("AddToCart")]
        public async Task<IActionResult> AddToCart([FromBody] Cart cartItem)
        {
            var userId = GetLoggedInUserId();

            if (cartItem.ProductId <= 0 || cartItem.ProductQuantity <= 0)
            {
                return BadRequest("Invalid cart data.");
            }
                

            var product = await _context.Products
                .Where(p => p.ProductId == cartItem.ProductId)
                .Select(p => new { p.ProductId, p.Price })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            var existingCartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == cartItem.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.ProductQuantity += cartItem.ProductQuantity;
                existingCartItem.TotalAmount = existingCartItem.ProductQuantity * product.Price;
            }
            else
            {
                _context.Carts.Add(new Cart
                {
                    UserId = userId,
                    ProductId = product.ProductId,
                    ProductQuantity = cartItem.ProductQuantity,
                    Price = product.Price,
                    TotalAmount = cartItem.ProductQuantity * product.Price,
                    CreatedAt = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product added to cart successfully!" });
        }

        // Get Cart Items
        [HttpGet("GetCartItems")]
        public async Task<IActionResult> GetCartItems()
        {
            var userId = GetLoggedInUserId();

            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .Select(c => new
                {
                    c.CartId,
                    c.ProductId,
                    ProductName = c.Product.ProductName,
                    c.ProductQuantity,
                    c.Price,
                    c.TotalAmount
                })
                .ToListAsync();

            return cartItems.Any() ? Ok(cartItems) : NotFound("No items in your cart.");
        }

        // Increase Cart Quantity
        [HttpPut("increaseQuantity/{cartId}")]
        public async Task<IActionResult> IncreaseCartQuantity(int cartId)
        {
            var userId = GetLoggedInUserId();
            var cartItem = await _context.Carts.FindAsync(cartId);

            if (cartItem == null || cartItem.UserId != userId)
            {
                return NotFound("Cart item not found.");
            }
                

            cartItem.ProductQuantity++;
            cartItem.TotalAmount = cartItem.ProductQuantity * cartItem.Price;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart quantity increased." });
        }

        // Decrease Cart Quantity (Auto Remove if Quantity = 0)
        [HttpPut("decreaseQuantity/{cartId}")]
        public async Task<IActionResult> DecreaseCartQuantity(int cartId)
        {
            var userId = GetLoggedInUserId();
            var cartItem = await _context.Carts.FindAsync(cartId);

            if (cartItem == null || cartItem.UserId != userId)
            {
                return NotFound("Cart item not found.");
            }
                

            if (cartItem.ProductQuantity > 1)
            {
                cartItem.ProductQuantity--;
                cartItem.TotalAmount = cartItem.ProductQuantity * cartItem.Price;
            }
            else
            {
                _context.Carts.Remove(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart quantity decreased." });
        }

        // Remove Item from Cart
        [HttpDelete("RemoveFromCart/{cartId}")]
        public async Task<IActionResult> RemoveFromCart(int cartId)
        {
            var userId = GetLoggedInUserId();
            var cartItem = await _context.Carts.FindAsync(cartId);

            if (cartItem == null || cartItem.UserId != userId)
                return NotFound("Cart item not found.");

            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart." });
        }

        // Clear Cart
        [HttpDelete("ClearCart")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetLoggedInUserId();
            var cartItems = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();

            if (!cartItems.Any())
                return NotFound("Your cart is already empty.");

            _context.Carts.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart cleared successfully." });
        }
    }
}
