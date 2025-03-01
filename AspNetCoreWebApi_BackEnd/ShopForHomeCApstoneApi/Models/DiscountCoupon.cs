using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHomeCApstoneApi.Models
{
    public partial class DiscountCoupon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CouponId { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100.")]
        public decimal DiscountPercentage { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public bool IsActive { get; set; } = true; // Default to active

        // Many-to-Many Relationship with Users (via UserCoupon)

        public virtual ICollection<UserCoupon> UserCoupons { get; set; } = new List<UserCoupon>();
    }
}
