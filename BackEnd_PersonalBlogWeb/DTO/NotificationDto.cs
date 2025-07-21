namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class NotificationDto
	{
		public int Id { get; set; }
		public string Message { get; set; } = string.Empty;
		public bool? IsRead { get; set; }
	}
}
