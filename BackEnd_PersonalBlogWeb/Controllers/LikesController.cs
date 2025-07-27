using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class LikeController : BaseController
	{
		private readonly LikeDAO _likeDao;
		private readonly PostDAO _postDao;
		private readonly CommentDAO _commentDao;
		private readonly NotificationDAO _notificationDao;

		public LikeController(LikeDAO likeDao, PostDAO postDao, CommentDAO commentDao,
			NotificationDAO notificationDao)
		{
			_likeDao = likeDao;
			_postDao = postDao;
			_commentDao = commentDao;
			_notificationDao = notificationDao;
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> ToggleLike([FromBody] LikeDto dto)
		{
			if (IsBlocked) return Forbid();
			if (!CurrentUserId.HasValue) return Unauthorized();

			var isLiked = await _likeDao.ToggleLikeAsync(CurrentUserId.Value, dto);

			if (isLiked)
			{
				string? message = null;
				int? receiverId = null;

				if (dto.PostId.HasValue)
				{
					var post = await _postDao.GetPostByIdAsync(dto.PostId.Value);
					if (post != null && post.AuthorID != CurrentUserId)
					{
						receiverId = post.AuthorID;
						message = $"{User.Identity!.Name} đã thích bài viết của bạn.";
					}

					// Gửi realtime cập nhật số like bài viết
				}
				else if (dto.CommentId.HasValue)
				{
					var comment = await _commentDao.GetCommentByIdAsync(dto.CommentId.Value);
					if (comment != null)
					{
						if (comment.UserId != CurrentUserId)
						{
							receiverId = comment.UserId;
							message = $"{User.Identity!.Name} đã thích bình luận của bạn.";
						}

						// Gửi realtime cập nhật số like bình luận
					}
				}

				if (receiverId.HasValue && message != null)
				{
					await _notificationDao.CreateNotificationAsync(receiverId.Value, message);
				}
			}

			return Ok(new { message = isLiked ? "Liked" : "Unliked" });
		}

		[HttpGet("is-liked")]
		[Authorize]
		public async Task<IActionResult> IsLiked([FromQuery] int? postId, [FromQuery] int? commentId)
		{
			if (IsBlocked) return Forbid();
			if (!CurrentUserId.HasValue) return Unauthorized();

			var isLiked = await _likeDao.IsLikedAsync(CurrentUserId.Value, postId, commentId);
			return Ok(new { isLiked });
		}

		[HttpGet("is-liked-post")]
		[Authorize]
		public async Task<IActionResult> IsLikedPost([FromQuery] int postId)
		{
			if (IsBlocked) return Forbid();
			if (!CurrentUserId.HasValue) return Unauthorized();

			var isLiked = await _likeDao.IsLikedPostAsync(CurrentUserId.Value, postId);
			return Ok(new { isLiked });
		}

		[HttpGet("is-liked-comment")]
		[Authorize]
		public async Task<IActionResult> IsLikedComment([FromQuery] int commentId)
		{
			if (IsBlocked) return Forbid();
			if (!CurrentUserId.HasValue) return Unauthorized();

			var isLiked = await _likeDao.IsLikedCommentAsync(CurrentUserId.Value, commentId);
			return Ok(new { isLiked });
		}

	}

}
