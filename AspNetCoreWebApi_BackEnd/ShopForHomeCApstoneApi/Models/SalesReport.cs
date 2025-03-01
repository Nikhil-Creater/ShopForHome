using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHomeCApstoneApi.Models
{
    public partial class SalesReport
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReportId { get; set; }

        [Required]
        public DateTime ReportPeriodStart { get; set; }

        [Required]
        public DateTime ReportPeriodEnd { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Total sales cannot be negative.")]
        public decimal TotalSales { get; set; }

        [Required]
        public DateTime GeneratedAt { get; set; } = DateTime.Now; // Removed nullable `?`


        // Custom validation to ensure ReportPeriodEnd > ReportPeriodStart
        public bool IsValidReportPeriod()
        {
            return ReportPeriodEnd > ReportPeriodStart;
        }
    }
}
