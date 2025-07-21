namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class PostCreateRequest
	{
		public string Title { get; set; } = null!;
		public string Content { get; set; } = null!;
		public int CategoryId { get; set; }
		public int AuthorId { get; set; }
		public string? CoverImage { get; set; }
		public byte Status { get; set; } = 0; // 0: pending, 1: approved, 2: rejected
	}
}
