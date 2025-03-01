using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHomeCApstoneApi.Models
{

    public partial class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        [Required]
        public int UserId { get; set; }

        public int? CouponId { get; set; } // Nullable, since not all orders may have a coupon

        [Required]
        public decimal TotalAmount { get; set; }


        public decimal? DiscountAmount { get; set; } = 0; // Default to 0 if no discount

        [Required]
        public decimal FinalAmount { get; set; }

        public string Address { get; set; }

        [Required]
        public string OrderStatus { get; set; } = "Pending"; // Enum instead of string

        public DateTime CreatedAt { get; set; } = DateTime.Now; // Auto-set on creation


        // Relationships
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("CouponId")]
        public virtual DiscountCoupon? DiscountCoupon { get; set; } // Nullable

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
