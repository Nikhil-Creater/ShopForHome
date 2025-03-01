using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHomeCApstoneApi.Models
{
    public class UserCoupon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserCouponId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int? CouponId { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime? ExpiryDate { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("CouponId")]
        public virtual DiscountCoupon DiscountCoupon { get; set; } = null!;
    }
}
