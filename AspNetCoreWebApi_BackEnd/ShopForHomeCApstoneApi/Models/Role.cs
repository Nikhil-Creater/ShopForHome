using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopForHomeCApstoneApi.Models
{
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoleId { get; set; }

        [Required]
        public string RoleName { get; set; } = null!; // Ensures non-null initialization

        //[JsonIgnore] // Prevents infinite loops in JSON serialization
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
