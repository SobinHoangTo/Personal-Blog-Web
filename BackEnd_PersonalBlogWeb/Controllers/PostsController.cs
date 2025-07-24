using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using System.Threading.Tasks;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PostsController : BaseController
	{
		private readonly PostDAO _PostDao;

		public PostsController(PostDAO PostDao)
		{
			_PostDao = PostDao;
		}

		// GET: api/Posts
		[HttpGet]
		public async Task<IActionResult> GetPosts()
		{
			var posts = await _PostDao.GetPostsAsync();
			return Ok(posts);
		}

		// GET: api/Posts/admin
		[HttpGet("admin")]
		public async Task<IActionResult> GetPostsForAdmin()
		{
			var posts = await _PostDao.GetPostsForAdminAsync();
			if (posts == null || !posts.Any())
			{
				return NotFound(new { message = "No posts found for admin." });
			}
			return Ok(posts);
		}

		// GET: api/Posts/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetPost(int id)
		{
			var post = await _PostDao.GetPostByIdAsync(id);
			return post == null ? NotFound(new { message = "Post not found" }) : Ok(post);
		}

		// GET: api/Posts/category/5
		[HttpGet("category/{categoryId}")]
		public async Task<IActionResult> GetPostsByCategory(int categoryId)
		{
			var posts = await _PostDao.GetByCategoryAsync(categoryId);
			return posts == null || !posts.Any()
				? NotFound(new { message = "No posts found for this category" })
				: Ok(posts);
		}

		// GET: api/Posts/author/5
		[HttpGet("author/{authorId}")]
		public async Task<IActionResult> GetPostsByAuthor(int authorId)
		{
			var posts = await _PostDao.GetByAuthorAsync(authorId);
			return posts == null || !posts.Any()
				? NotFound(new { message = "No posts found for this author" })
				: Ok(posts);
		}

		// POST: api/Posts
		[Authorize]
		[HttpPost]
		public async Task<IActionResult> CreatePost([FromBody] PostCreateRequest request)
		{
			if (CurrentUserId == null || IsBlocked)
				return Unauthorized("Access denied.");

			request.AuthorId = CurrentUserId.Value;
			var createdPost = await _PostDao.CreatePostAsync(request, CurrentUserId.Value);
			return CreatedAtAction(nameof(GetPost), new { id = createdPost.Id }, createdPost);
		}

		// PUT: api/Posts/5
		[Authorize]
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdatePost(int id, [FromBody] PostUpdateRequest request)
		{
			var post = await _PostDao.FindEntityByIdAsync(id);
			if (post == null)
				return NotFound(new { message = "Post not found" });

			// Only the owner or Staff/Admin can edit
			if (!IsOwner(post.AuthorId) && !IsAdmin && !IsStaff)
				return Forbid("You are not allowed to edit this post.");

			var updated = await _PostDao.UpdatePostAsync(id, request);
			return Ok(updated);
		}

		// DELETE: api/Posts/5
		[Authorize]
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletePost(int id)
		{
			var post = await _PostDao.FindEntityByIdAsync(id);
			if (post == null)
				return NotFound(new { message = "Post not found" });

			// Only the owner or Staff/Admin can delete
			if (!IsOwner(post.AuthorId) && !IsAdmin && !IsStaff)
				return Forbid("You are not allowed to delete this post.");

			var deleted = await _PostDao.DeletePostAsync(id);
			return deleted ? NoContent() : StatusCode(500, "Failed to delete post");
		}

		// PATCH: api/Posts/5/soft-delete
		[Authorize]
		[HttpPatch("{id}/soft-delete")]
		public async Task<IActionResult> SoftDeletePost(int id)
		{
			var post = await _PostDao.FindEntityByIdAsync(id);
			if (post == null)
				return NotFound(new { message = "Post not found" });

			// Owner, Admin, or Staff can soft delete posts
			if (!IsOwner(post.AuthorId) && !IsAdmin && !IsStaff)
				return Forbid("You are not allowed to delete this post.");

			// Update post status to 99 (soft deleted)
			var updateRequest = new PostUpdateRequest
			{
				Title = post.Title,
				Content = post.Content,
				CategoryId = post.CategoryId ?? 1,
				Status = 99,
				CoverImage = post.CoverImage
			};

			var updated = await _PostDao.UpdatePostAsync(id, updateRequest);
			return Ok(new { message = "Post soft deleted successfully", post = updated });
		}

		// GET: api/Posts/search
		[HttpGet("search")]
		public async Task<IActionResult> SearchPosts([FromQuery] string? keyword, [FromQuery] int? categoryId, [FromQuery] int? authorId)
		{
			if (string.IsNullOrWhiteSpace(keyword) && categoryId == null && authorId == null)
				return BadRequest(new { message = "At least one search parameter is required" });

			var results = await _PostDao.SearchPostsAsync(keyword, categoryId, authorId);
			return results == null || !results.Any()
				? NotFound(new { message = "No posts found matching criteria" })
				: Ok(results);
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPut("{id}/approve")]
		public async Task<IActionResult> ApprovePost(int id)
		{
			var success = await _PostDao.ApprovePostAsync(id);
			if (!success) return NotFound("Post not found");
			return Ok("Post approved");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPut("{id}/reject")]
		public async Task<IActionResult> RejectPost(int id)
		{
			var success = await _PostDao.RejectPostAsync(id);
			if (!success) return NotFound("Post not found");
			return Ok("Post rejected");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPut("{id}/restore")]
		public async Task<IActionResult> RestorePost(int id)
		{
			var success = await _PostDao.RestorePostAsync(id);
			if (!success) return NotFound("Post not found");
			return Ok("Post restored");
		}
	}
}
