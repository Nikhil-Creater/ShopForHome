using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShopForHomeCApstoneApi.AppModule;
using ShopForHomeCApstoneApi.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ShopForHomeCApstoneApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(ShopForHomeDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserModel userModel)
        {
            if (userModel == null || string.IsNullOrEmpty(userModel.Email) || string.IsNullOrEmpty(userModel.Password))
                return BadRequest("Invalid login request.");

            string hashedPassword = HashPassword(userModel.Password);

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == userModel.Email && u.PasswordHash == hashedPassword);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            // Create claims
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),  // Add UserId for reference
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role.RoleName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(20), // Expiry time for jwt token
                signingCredentials: creds
            );

            userModel.FullName = user.FullName;
            userModel.Address = user.Address;
            userModel.UserId = user.UserId;
            userModel.RoleId = user.RoleId;
            userModel.AccessToken = new JwtSecurityTokenHandler().WriteToken(token);
            userModel.UserMessage = "Login successful!";

            return Ok(userModel);
        }

        // Secure password hashing using SHA256
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
