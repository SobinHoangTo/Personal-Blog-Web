namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class PostUpdateRequest
	{
		public string Title { get; set; } = null!;
		public string Content { get; set; } = null!;
		public int CategoryId { get; set; }
		public string? CoverImage { get; set; } // nếu có upload ảnh
		public byte Status { get; set; }
	}
}
