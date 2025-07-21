namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class CommentDto
	{
		public int Id { get; set; }
		public string Content { get; set; } = string.Empty;
		public int? AuthorId { get; set; }
		public string AuthorName { get; set; } = string.Empty;
		public DateTime CreatedDate { get; set; }
		public int? ParentCommentId { get; set; }
		public List<CommentDto> Replies { get; set; } = new();
	}


}
