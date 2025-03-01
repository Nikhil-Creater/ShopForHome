using System;
using System.ComponentModel.DataAnnotations;

namespace ShopForHomeCApstoneApi.Models
{
    public class StockAlert
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int ProductId { get; set; }

        public bool IsRead { get; set; } = false; // Track if the notification is read
    }
}
