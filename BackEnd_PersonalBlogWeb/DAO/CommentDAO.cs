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

		public async Task<List<CommentDto>> GetCommentsByPostIdAsync(int postId)
		{
			var comments = await _context.Comments
				.Where(c => c.PostId == postId)
				.Include(c => c.User)
				.ToListAsync();

			var commentDtos = comments.Select(c => new CommentDto
			{
				Id = c.Id,
				Content = c.Content,
				AuthorId = c.UserId,
				AuthorName = c.User.FullName,
				AuthorAvatar = c.User.Avatar ?? string.Empty,
				CreatedDate = DateTime.Now,
				ParentCommentId = c.ParentCommentId,
				Replies = new List<CommentDto>()
			}).ToList();

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
