namespace Project_PRN232_PersonalBlogWeb.DTO
{
	public class ResetPasswordRequest
	{
		public string Email { get; set; }
		public string NewPassword { get; set; }
		public string ResetToken { get; set; } // optional: if email verification implemented
	}
}
