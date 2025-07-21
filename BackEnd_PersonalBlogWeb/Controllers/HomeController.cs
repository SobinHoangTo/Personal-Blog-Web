using Microsoft.AspNetCore.Mvc;
using Project_PRN232_PersonalBlogWeb.DAO;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HomeController : BaseController
	{
		private readonly PostDAO _PostDao;
		private readonly CategoryDAO _CateDao;

		public HomeController(PostDAO PostDao, CategoryDAO CategoryDao)
		{
			_PostDao = PostDao;
			_CateDao = CategoryDao;
		}

		[HttpGet]
		public async Task<IActionResult> GetHomeData()
		{
			var posts = await _PostDao.GetPostsAsync();
			var categories = await _CateDao.GetAllCategoriesAsync();

			if (posts == null || !posts.Any())
			{
				return NotFound(new { message = "No posts found" });
			}

			if (categories == null || !categories.Any())
			{
				return NotFound(new { message = "No categories found" });
			}

			return Ok(new
			{
				Posts = posts,
				Categories = categories
			});
		}
	}
}
