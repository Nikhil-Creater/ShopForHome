using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using ShopForHomeCApstoneApi.AppModule;
using ShopForHomeCApstoneApi.Models;

namespace ShopForHomeCApstoneApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public UsersController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return Ok(users);
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
                
            return user;
        }

        [HttpPut("UpdateUser/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
                return BadRequest();
            user.PasswordHash = user.NormalPassword;
   
            user.PasswordHash = HashPassword(user.PasswordHash);

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                throw;
            }

            return Ok(user);
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.NormalPassword))
                return BadRequest(new {Message = "Invalid user data." });

            user.PasswordHash = user.NormalPassword;
            user.PasswordHash = HashPassword(user.PasswordHash);

            // Assign default role "User"
            if (user.RoleId == 0)
            {
                var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
                if (defaultRole == null)
                {
                    return BadRequest(new {Message = "Default role not found in database." });
                }
                    

                user.RoleId = defaultRole.RoleId;
            }
            else
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == user.RoleId);
                if (role == null)
                    return BadRequest(new {Message = "Invalid role provided." });
            }

            // Attach role to avoid tracking issues
            _context.Attach(user);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id) => _context.Users.Any(e => e.UserId == id);

        //Method to hash the password
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
