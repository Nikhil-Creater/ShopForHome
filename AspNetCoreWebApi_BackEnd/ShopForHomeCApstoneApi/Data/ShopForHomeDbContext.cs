using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;

namespace ShopForHomeCApstoneApi.Models
{
    public class ShopForHomeDbContext : DbContext
    {
        public ShopForHomeDbContext(DbContextOptions<ShopForHomeDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cart> Carts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<DiscountCoupon> DiscountCoupons { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SalesReport> SalesReports { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserCoupon> UserCoupons { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<StockAlert> StockAlerts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            

            //  Seed Default Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "User" }
            );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Furniture" },
                new Category { CategoryId = 2, CategoryName = "Home Decor" },
                new Category { CategoryId = 3, CategoryName = "Lighting" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    ProductId = 1,
                    ProductName = "Wooden Dining Table",
                    Description = "Solid wood dining table with modern design.",
                    Price = 15000,
                    CategoryId = 1,
                    CategoryName = "Furniture",
                    StockQuantity = 20,
                    Rating = 4.5,
                    ImageUrl = "https://m.media-amazon.com/images/I/41aSOoUwLYL._SY300_SX300_QL70_FMwebp_.jpg"
                },
                new Product
                {
                    ProductId = 2,
                    ProductName = "Decorative Wall Mirror",
                    Description = "Elegant wall mirror for home décor.",
                    Price = 3500,
                    CategoryId = 2,
                    CategoryName = "Home Decor",
                    StockQuantity = 30,
                    Rating = 4.2,
                    ImageUrl = "https://m.media-amazon.com/images/I/51aA2qy0xyL._SY300_SX300_QL70_FMwebp_.jpg"
                },
                new Product
                {
                    ProductId = 3,
                    ProductName = "LED Ceiling Light",
                    Description = "Energy-efficient LED ceiling light.",
                    Price = 2200,
                    CategoryId = 3,
                    CategoryName = "Lighting",
                    StockQuantity = 50,
                    Rating = 4.8,
                    ImageUrl = "https://www.nobroker.in/blog/wp-content/uploads/2024/03/19-ceiling-light-designs-to-transform-your-home.jpg"
                }
            );

            // Secure Password Hashing (Using Identity PasswordHasher)

            string adminPassword = HashPassword("Abhishek@123"); // Secure password hashing
            string userPassword = HashPassword("User@123");

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    FullName = "Abhishek Jaybhaye",
                    Email = "abhi@example.com",
                    Address = "Sonewadi,Sangamner,Maharashtra,422611",
                    PasswordHash = adminPassword,
                    NormalPassword = "Abhishek@123",
                    RoleId = 1
                },
                new User
                {
                    UserId = 2,
                    FullName = "Regular User",
                    Email = "user@example.com",
                    Address = "Sample,Sample1,Maharashtra,422611",
                    PasswordHash = userPassword,
                    NormalPassword = "User@123",
                    RoleId = 2
                }
            );
        }

        // Method to hash the password
        private static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
