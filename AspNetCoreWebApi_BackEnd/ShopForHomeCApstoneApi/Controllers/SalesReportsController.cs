using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesReportsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public SalesReportsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // Generate a new Sales Report (Without Order Relation)
        [HttpPost("GenerateSalesReport")]
        public async Task<IActionResult> GenerateSalesReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Validate dates
            if (startDate >= endDate)
                return BadRequest(new { message = "Start date must be earlier than end date." });

            if (startDate > DateTime.Now || endDate > DateTime.Now)
                return BadRequest(new { message = "Dates cannot be in the future." });

            // Fetch orders within the date range
            var orders = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.OrderStatus == "Complete")
                .ToListAsync();

            if (!orders.Any())
                return NotFound(new { message = "No sales found for the given period." });

            // Calculate total sales
            decimal totalSales = orders.Sum(o => o.TotalAmount);

            // Create a new sales report entry (without Orders relation)
            var salesReport = new SalesReport
            {
                ReportPeriodStart = startDate,
                ReportPeriodEnd = endDate,
                TotalSales = totalSales,
                GeneratedAt = DateTime.Now
            };

            // Save the sales report to the database
            _context.SalesReports.Add(salesReport);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sales report generated successfully!", reportId = salesReport.ReportId });
        }

        // Get All Sales Reports (Without Order Relation)
        [HttpGet("GetAllSalesReports")]
        public async Task<IActionResult> GetAllSalesReports()
        {
            var reports = await _context.SalesReports.ToListAsync();

            if (!reports.Any())
                return NotFound(new { message = "No sales reports found." });

            return Ok(reports);
        }

    }
}
