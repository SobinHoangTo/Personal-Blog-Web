using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using System;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class LikeDAO
	{
		private readonly PersonalBlogWebContext _context;

		public LikeDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}

		public async Task<bool> ToggleLikeAsync(int userId, LikeDto dto)
		{
			// Kiểm tra target là post hay comment
			bool isPostLike = dto.PostId.HasValue;
			bool isCommentLike = dto.CommentId.HasValue;

			if (!isPostLike && !isCommentLike)
				throw new ArgumentException("Must provide PostId or CommentId");

			var existingLike = await _context.Likes.FirstOrDefaultAsync(l =>
				l.UserId == userId &&
				l.PostId == dto.PostId &&
				l.CommentId == dto.CommentId);

			if (existingLike != null)
			{
				// Unlike
				_context.Likes.Remove(existingLike);
			}
			else
			{
				// Like
				var newLike = new Like
				{
					UserId = userId,
					PostId = dto.PostId,
					CommentId = dto.CommentId
				};
				_context.Likes.Add(newLike);
			}

			await _context.SaveChangesAsync();
			return existingLike == null; // true nếu là Like, false nếu là Unlike
		}

		public async Task<int> CountLikesForPostAsync(int postId)
		{
			return await _context.Likes.CountAsync(l => l.PostId == postId);
		}

		public async Task<int> CountLikesForCommentAsync(int commentId)
		{
			return await _context.Likes.CountAsync(l => l.CommentId == commentId);
		}

		public async Task<bool> IsLikedAsync(int userId, int? postId, int? commentId)
		{
			return await _context.Likes.AnyAsync(l =>
				l.UserId == userId &&
				l.PostId == postId &&
				l.CommentId == commentId);
		}
	}

}
