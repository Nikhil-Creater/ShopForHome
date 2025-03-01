using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public OrderController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // Place an order
        [Authorize(Roles = "User")]
        [HttpPost("placeOrder/{userId}")]
        public async Task<IActionResult> PlaceOrder(int userId, [FromBody] List<int> cartItemIds, [FromQuery] int? couponId = null)
        {
            if (cartItemIds == null || !cartItemIds.Any())
            {
                return BadRequest(new { message = "No items selected for checkout!" });
            }
                

            // Get the selected cart items
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId && cartItemIds.Contains(c.CartId))
                .Include(c => c.Product)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest(new { message = "No valid cart items found!" });
            }
                

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Calculate total amount
                decimal totalAmount = cartItems.Sum(c => c.Product.Price * c.ProductQuantity);
                decimal discountAmount = 0;
                decimal finalAmount = totalAmount;
                int? appliedCouponId = null;

                // Apply coupon if provided
                if (couponId.HasValue)
                {
                    var userCoupon = await _context.UserCoupons
                        .Where(uc => uc.UserId == userId && uc.CouponId == couponId.Value && !uc.IsUsed)
                        .Include(uc => uc.DiscountCoupon)
                        .FirstOrDefaultAsync();

                    if (userCoupon == null)
                    {
                        return BadRequest(new { message = "Invalid or already used coupon!" });
                    }

                    if (!userCoupon.DiscountCoupon.IsActive || userCoupon.DiscountCoupon.ExpiryDate <= DateTime.Now)
                    {
                        return BadRequest(new { message = "Coupon has expired or is inactive!" });
                    }

                    // Apply discount
                    discountAmount = totalAmount * (userCoupon.DiscountCoupon.DiscountPercentage / 100);
                    finalAmount = totalAmount - discountAmount;
                    appliedCouponId = couponId;

                    // Mark coupon as used
                    userCoupon.IsUsed = true;
                    _context.UserCoupons.Update(userCoupon);
                }

                // Get user to fetch address
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found!" });
                }

                // Create a new order
                var order = new Order
                {
                    UserId = userId,
                    CouponId = appliedCouponId,
                    TotalAmount = totalAmount,
                    DiscountAmount = discountAmount,
                    FinalAmount = finalAmount,
                    Address = user.Address,
                    OrderStatus = "Complete"   
                };
                try
                {
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new
                    {
                        message = "An error occurred while placing the order.",
                        error = ex.InnerException?.Message ?? ex.Message
                    });
                }


                List<StockAlert> notifications = new List<StockAlert>();

                // Create order items and update stock
                foreach (var cartItem in cartItems)
                {
                    if (cartItem.Product.StockQuantity <= cartItem.ProductQuantity)
                    {
                        return BadRequest(new { message = $"Insufficient stock for {cartItem.Product.ProductName}" });
                    }

                    // Reduce stock
                    cartItem.Product.StockQuantity -= cartItem.ProductQuantity;

                    // Add order item
                    var orderItem = new OrderItem
                    {
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.ProductQuantity,
                        Price = cartItem.Product.Price,
                        OrderId = order.OrderId
                    };

                    _context.OrderItems.Add(orderItem);

                    // Check for low stock and create a notification if needed
                    if (cartItem.Product.StockQuantity < 10)
                    {
                        notifications.Add(new StockAlert
                        {
                            ProductId = cartItem.Product.ProductId,
                            Message = $"Stock for {cartItem.Product.ProductName} is low ({cartItem.Product.StockQuantity} left).",
                            IsRead = false,
                            CreatedAt = DateTime.Now
                        });
                    }
                }

                // Save order items, update stock, and notifications
                await _context.SaveChangesAsync();

                // Add notifications if any
                if (notifications.Any())
                {
                    _context.StockAlerts.AddRange(notifications);
                    await _context.SaveChangesAsync();
                }

                // Remove only selected cart items
                //_context.Carts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return Ok(new { message = "Order placed successfully!", orderId = order.OrderId, appliedCouponId, finalAmount });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while placing the order.", error = ex.Message });
            }
        }


        // Get all orders for a user
        [Authorize(Roles = "User")]
        [HttpGet("GetOrders/{userId}")]
        public async Task<IActionResult> GetOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            if (orders == null || !orders.Any())
                return NotFound(new { message = "No orders found for this user." });

            return Ok(orders);
        }


        // Get all orders (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            if (orders == null || !orders.Any())
                return NotFound(new { message = "No orders found." });

            return Ok(orders);
        }  
        
    }
}

