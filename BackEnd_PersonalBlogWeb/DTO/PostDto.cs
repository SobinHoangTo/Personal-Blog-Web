namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class PostDto
	{
		public int Id { get; set; }
		public string? Title { get; set; }
		public string? Content { get; set; }
		public string? CoverImage { get; set; }
		public int? AuthorID { get; set; }
		public string? AuthorName { get; set; }
		public string? AuthorAvatar { get; set; }
		public DateTime CreatedDate { get; set; }
		public string? CategoryName { get; set; }
		public int LikeCount { get; set; }
		public int CommentCount { get; set; }
		public List<CommentDto>? Comments { get; set; }
		public int Status { get; set; }
	}

}
