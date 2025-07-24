using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.Models;
using Project_PRN232_PersonalBlogWeb.DTO;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class PostDAO
	{
		private readonly PersonalBlogWebContext _context;

		public PostDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<PostDto>> GetPostsAsync()
		{
			return await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.Where(p => p.Status == 1)
				.OrderByDescending(p => p.CreatedDate)
				.Select(p => new PostDto
				{
					Id = p.Id,
					Title = p.Title,
					Content = p.Content,
					CoverImage = p.CoverImage,
					AuthorID = p.AuthorId,
					AuthorName = p.Author.FullName,
					AuthorAvatar = p.Author.Avatar,
					CreatedDate = p.CreatedDate,
					CategoryName = p.Category.Name,
					LikeCount = p.Likes.Count,
					CommentCount = p.Comments.Count,
					Status = p.Status
				})
				.ToListAsync();
		}

		public async Task<IEnumerable<PostDto>> GetPostsForAdminAsync()
		{
			return await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.OrderByDescending(p => p.CreatedDate)
				.Select(p => new PostDto
				{
					Id = p.Id,
					Title = p.Title,
					Content = p.Content,
					CoverImage = p.CoverImage,
					AuthorID = p.AuthorId,
					AuthorName = p.Author.FullName,
					AuthorAvatar = p.Author.Avatar,
					CreatedDate = p.CreatedDate,
					CategoryName = p.Category.Name,
					LikeCount = p.Likes.Count,
					CommentCount = p.Comments.Count,
					Status = p.Status
				})
				.ToListAsync();
		}

		public async Task<PostDto?> GetPostByIdAsync(int id)
		{
			var post = await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
					.ThenInclude(c => c.User)
				.FirstOrDefaultAsync(p => p.Id == id && p.Status == 1);

			if (post == null) return null;

			// Map tất cả comment thành DTO
			var commentDtos = post.Comments.Select(c => new CommentDto
			{
				Id = c.Id,
				Content = c.Content,
				AuthorId = c.UserId,
				AuthorName = c.User.FullName,
				AuthorAvatar = c.User.Avatar,
				ParentCommentId = c.ParentCommentId,
				Replies = new List<CommentDto>(),
			}).ToList();

			// Dựng cây cha-con
			var commentLookup = commentDtos.ToLookup(c => c.ParentCommentId);
			foreach (var comment in commentDtos)
			{
				comment.Replies = commentLookup[comment.Id].ToList();
			}

			// Chỉ trả về comment cha
			var rootComments = commentDtos.Where(c => c.ParentCommentId == null).ToList();

			return new PostDto
			{
				Id = post.Id,
				Title = post.Title,
				Content = post.Content,
				CoverImage = post.CoverImage,
				AuthorID = post.AuthorId,
				AuthorName = post.Author.FullName,
				AuthorAvatar = post.Author.Avatar,
				CreatedDate = post.CreatedDate,
				CategoryName = post.Category?.Name,
				LikeCount = post.Likes.Count,
				CommentCount = post.Comments.Count,
				Comments = rootComments,
				Status = post.Status
			};
		}


		public async Task<Post?> FindEntityByIdAsync(int id)
		{
			return await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.FirstOrDefaultAsync(p => p.Id == id);
		}


		public async Task<IEnumerable<PostDto>> GetByCategoryAsync(int categoryId)
		{
			return await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.Where(p => p.CategoryId == categoryId && p.Status == 1)
				.Select(p => new PostDto
				{
					Id = p.Id,
					Title = p.Title,
					Content = p.Content,
					CoverImage = p.CoverImage,
					AuthorID = p.AuthorId,
					AuthorName = p.Author.FullName,
					AuthorAvatar = p.Author.Avatar,
					CreatedDate = p.CreatedDate,
					CategoryName = p.Category.Name,
					LikeCount = p.Likes.Count,
					CommentCount = p.Comments.Count,
					Status = p.Status
				})
				.ToListAsync();
		}

		public async Task<IEnumerable<PostDto>> GetByAuthorAsync(int authorId)
		{
			return await _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.Where(p => p.AuthorId == authorId && p.Status == 1)
				.Select(p => new PostDto
				{
					Id = p.Id,
					Title = p.Title,
					Content = p.Content,
					CoverImage = p.CoverImage,
					AuthorID = p.AuthorId,
					AuthorName = p.Author.FullName,
					AuthorAvatar = p.Author.Avatar,
					CreatedDate = p.CreatedDate,
					CategoryName = p.Category.Name,
					LikeCount = p.Likes.Count,
					CommentCount = p.Comments.Count,
					Status = p.Status
				})
				.ToListAsync();
		}

		public async Task<IEnumerable<PostDto>> SearchPostsAsync(string? search, int? categoryId, int? authorId)
		{
			var query = _context.Posts
				.Include(p => p.Author)
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.Where(p => p.Status == 1);

			if (!string.IsNullOrEmpty(search))
			{
				query = query.Where(p => p.Title.Contains(search) || p.Content.Contains(search));
			}

			if (categoryId.HasValue)
			{
				query = query.Where(p => p.CategoryId == categoryId);
			}

			if (authorId.HasValue)
			{
				query = query.Where(p => p.AuthorId == authorId);
			}

			return await query
				.Select(p => new PostDto
				{
					Id = p.Id,
					Title = p.Title,
					Content = p.Content,
					CoverImage = p.CoverImage,
					AuthorID = p.AuthorId,
					AuthorName = p.Author.FullName,
					AuthorAvatar = p.Author.Avatar,
					CreatedDate = p.CreatedDate,
					CategoryName = p.Category.Name,
					LikeCount = p.Likes.Count,
					CommentCount = p.Comments.Count,
					Status = p.Status
				})
				.ToListAsync();
		}

		public async Task<Post> CreatePostAsync(PostCreateRequest request, int authorId)
		{
			var post = new Post
			{
				Title = request.Title,
				Content = request.Content,
				CategoryId = request.CategoryId,
				AuthorId = authorId,
				CoverImage = request.CoverImage,
				Status = request.Status,
				CreatedDate = DateTime.Now
			};

			_context.Posts.Add(post);
			await _context.SaveChangesAsync();
			return post;
		}

		public async Task<PostDto?> UpdatePostAsync(int id, PostUpdateRequest request)
		{
			var post = await _context.Posts
				.Include(p => p.Category)
				.Include(p => p.Likes)
				.Include(p => p.Comments)
				.FirstOrDefaultAsync(p => p.Id == id);

			if (post == null)
			{
				return null;
			}

			post.Title = request.Title;
			post.Content = request.Content;
			post.CategoryId = request.CategoryId;
			post.CoverImage = request.CoverImage;
			post.Status = request.Status;

			_context.Posts.Update(post);
			await _context.SaveChangesAsync();

			return new PostDto
			{
				Id = post.Id,
				Title = post.Title,
				Content = post.Content,
				CoverImage = post.CoverImage,
				AuthorID = post.AuthorId,
				CreatedDate = post.CreatedDate,
				CategoryName = post.Category?.Name,
				LikeCount = post.Likes.Count,
				CommentCount = post.Comments.Count
			};
		}

		public async Task<bool> DeletePostAsync(int id)
		{
			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return false;
			}

			post.Status = 99; // Status = 99 means deleted/hidden
			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> ApprovePostAsync(int id)
		{
			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return false;
			}

			post.Status = 1;
			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> RejectPostAsync(int id)
		{
			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return false;
			}

			post.Status = 99;
			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<bool> RestorePostAsync(int id)
		{
			var post = await _context.Posts.FindAsync(id);
			if (post == null)
			{
				return false;
			}

			post.Status = 1;
			await _context.SaveChangesAsync();

			return true;
		}
	}
}
