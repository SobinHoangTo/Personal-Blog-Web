namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class UserResponse
	{
		public int Id { get; set; }
		public string Username { get; set; }
		public string FullName { get; set; }
		public string Email { get; set; }
		public int? Role { get; set; }
		public string Avatar { get; set; }
		public string Bio { get; set; }
	}
}
