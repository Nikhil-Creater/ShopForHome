using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHomeCApstoneApi.Models
{
    public partial class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductId { get; set; }

        [Required]
        public string ProductName { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public decimal Price { get; set; }

        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5.")]
        public double Rating { get; set; } = 0.0; // Default to 0 instead of nullable

        [Required]
        public int StockQuantity { get; set; }

        [Required]
        public int CategoryId { get; set; } // Keep foreign key reference

        public string CategoryName { get; set; }

        [Required]
        public string ImageUrl { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.Now; // Auto-set

        // Relationship
  
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }


        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
