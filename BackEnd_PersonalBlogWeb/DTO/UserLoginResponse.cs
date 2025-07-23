namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class UserLoginResponse
	{
		public string? UserId { get; set; }
		public string? Email { get; set; }
		public string? FullName { get; set; }
		public string? Username { get; set; }
		public string? Avatar { get; set; }
		public string? AccessToken { get; set; }
		public string Role { get; set; }
		public int ExpiresIn { get; set; }
	}
}
