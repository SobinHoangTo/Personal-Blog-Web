using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using System;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class CommentDAO
	{
		private readonly PersonalBlogWebContext _context;

		public CommentDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}

		public async Task<List<CommentDto>> GetCommentsByPostIdAsync(int postId, int? currentUserId = null)
		{
			var comments = await _context.Comments
				.Where(c => c.PostId == postId)
				.Include(c => c.User)
				.ToListAsync();

			var commentDtos = new List<CommentDto>();

			foreach (var c in comments)
			{
				// Count likes for this comment
				var likeCount = await _context.Likes.CountAsync(l => l.CommentId == c.Id);

				// Check if current user liked this comment
				var isLiked = false;
				if (currentUserId.HasValue)
				{
					isLiked = await _context.Likes.AnyAsync(l => l.CommentId == c.Id && l.UserId == currentUserId.Value);
				}

				commentDtos.Add(new CommentDto
				{
					Id = c.Id,
					Content = c.Content,
					AuthorId = c.UserId,
					AuthorName = c.User?.FullName ?? "Unknown User",
					AuthorAvatar = c.User?.Avatar ?? string.Empty,
					CreatedDate = DateTime.Now, // Since Comment model doesn't have CreatedDate, using current time
					ParentCommentId = c.ParentCommentId,
					Replies = new List<CommentDto>(),
					LikeCount = likeCount,
					IsLiked = isLiked
				});
			}

			var lookup = commentDtos.ToLookup(c => c.ParentCommentId);
			foreach (var comment in commentDtos)
			{
				comment.Replies = lookup[comment.Id].ToList();
			}

			return commentDtos.Where(c => c.ParentCommentId == null).ToList();
		}
		public async Task<Comment> AddCommentAsync(CreateCommentDto dto, int userId)
		{
			var comment = new Comment
			{
				PostId = dto.PostId,
				Content = dto.Content,
				UserId = userId,
				ParentCommentId = dto.ParentCommentId
			};

			_context.Comments.Add(comment);
			await _context.SaveChangesAsync();
			return comment;
		}

		public async Task<Comment?> GetCommentByIdAsync(int id)
		{
			return await _context.Comments.FindAsync(id);
		}

		public async Task<bool> UpdateCommentAsync(int commentId, string content)
		{
			var comment = await _context.Comments.FindAsync(commentId);
			if (comment == null) return false;

			comment.Content = content;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> DeleteCommentAsync(int commentId)
		{
			var comment = await _context.Comments.FindAsync(commentId);
			if (comment == null) return false;

			_context.Comments.Remove(comment);
			await _context.SaveChangesAsync();
			return true;
		}
	}
}
