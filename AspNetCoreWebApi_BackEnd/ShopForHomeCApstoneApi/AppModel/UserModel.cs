using ShopForHomeCApstoneApi.Models;
namespace ShopForHomeCApstoneApi.AppModule
{
    public class UserModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Address { get; set; } 
        public int UserId {  get; set; }
        public int RoleId { get; set; }
        public string UserMessage { get; set; } = "login status";
        public string AccessToken { get; set; } = "space for token";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
