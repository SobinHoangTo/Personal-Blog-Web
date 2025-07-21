namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class CreateCommentDto
	{
		public int PostId { get; set; }
		public string Content { get; set; } = string.Empty;
		public int? ParentCommentId { get; set; }
	}


}
