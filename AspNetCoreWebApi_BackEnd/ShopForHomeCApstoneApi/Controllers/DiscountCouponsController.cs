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
    
    [ApiController]
    [Route("api/discounts")]
    public class DiscountCouponsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public DiscountCouponsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // ADMIN: CREATE A DISCOUNT COUPON
        [Authorize(Roles = "Admin")]
        [HttpPost("createCoupon")]
        public async Task<IActionResult> CreateCoupon([FromBody] DiscountCoupon coupon)
        {
            if (coupon == null)
                return BadRequest(new { message = "Coupon details are required." });

            if (coupon.DiscountPercentage <= 0 || coupon.DiscountPercentage > 100)
                return BadRequest(new { message = "Discount must be between 0 and 100." });

            if (coupon.ExpiryDate <= DateTime.Now)
                return BadRequest(new { message = "Expiry date must be in the future." });

            coupon.IsActive = true;
            _context.DiscountCoupons.Add(coupon);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCouponById), new { couponId = coupon.CouponId }, coupon);
        }

        // ADMIN: GET COUPON BY ID
        [Authorize(Roles = "Admin")]
        [HttpGet("GetCouponById/{couponId}")]
        public async Task<IActionResult> GetCouponById(int couponId)
        {
            var coupon = await _context.DiscountCoupons.FindAsync(couponId);
            if (coupon == null)
                return NotFound(new { message = "Coupon not found." });

            return Ok(coupon);
        }

        // ADMIN: ASSIGN COUPON TO SPECIFIC USER
        [Authorize(Roles = "Admin")]
        [HttpPost("assign/{couponId}/to-user/{userId}")]
        public async Task<IActionResult> AssignCouponToUser(int couponId, int userId)
        {
            var coupon = await _context.DiscountCoupons.FindAsync(couponId);
            var user = await _context.Users.FindAsync(userId);
            var expiryDate = coupon.ExpiryDate;

            if (coupon == null)
                return NotFound(new { message = "Coupon not found." });

            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!coupon.IsActive || coupon.ExpiryDate < DateTime.Now)
                return BadRequest(new { message = "Coupon is expired or inactive." });

            var userCoupon = new UserCoupon
            {
                UserId = userId,
                CouponId = couponId,
                ExpiryDate = expiryDate
            };

            _context.UserCoupons.Add(userCoupon);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Coupon {couponId} assigned to User {userId}." });
        }

        // USER: GET AVAILABLE COUPONS
        [Authorize(Roles = "User")]
        [HttpGet("availableUserCoupon")]
        public async Task<IActionResult> GetAvailableCoupons()
        {
            
            var coupons = await _context.UserCoupons
                .Where(c => c.IsUsed == false && c.ExpiryDate > DateTime.Now)
                .ToListAsync();

            if (!coupons.Any())
                return NotFound(new { message = "No active coupons available." });

            return Ok(coupons);
        }

        // ADMIN: GET ALL COUPONS (ACTIVE & EXPIRED)
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllCoupons")]
        public async Task<IActionResult> GetAllCoupons()
        {
            var coupons = await _context.DiscountCoupons.ToListAsync();
            return Ok(coupons);
        }

        // ADMIN: DEACTIVATE A COUPON
        [Authorize(Roles = "Admin")]
        [HttpPut("deactivate/{couponId}")]
        public async Task<IActionResult> DeactivateCoupon(int couponId)
        {
            var coupon = await _context.DiscountCoupons.FindAsync(couponId);
            if (coupon == null)
                return NotFound(new { message = "Coupon not found." });

            coupon.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Coupon deactivated successfully!" });
        }

        // ADMIN: DELETE A COUPON
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{couponId}")]
        public async Task<IActionResult> DeleteCoupon(int couponId)
        {
            var coupon = await _context.DiscountCoupons.FindAsync(couponId);
            if (coupon == null)
                return NotFound(new { message = "Coupon not found." });

            _context.DiscountCoupons.Remove(coupon);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Coupon deleted successfully!" });
        }
    }
}
