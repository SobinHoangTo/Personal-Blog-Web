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
using Project_PRN232_PersonalBlogWeb.Hubs;
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
		private readonly IHubContext<NotificationHub> _hubContext;

		public LikeController(LikeDAO likeDao, PostDAO postDao, CommentDAO commentDao,
			NotificationDAO notificationDao, IHubContext<NotificationHub> hubContext)
		{
			_likeDao = likeDao;
			_postDao = postDao;
			_commentDao = commentDao;
			_notificationDao = notificationDao;
			_hubContext = hubContext;
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
					await _hubContext.Clients.Group($"post_{dto.PostId}")
						.SendAsync("PostUpdated", new { postId = dto.PostId, action = "like" });
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
						await _hubContext.Clients.Group($"post_{comment.PostId}")
							.SendAsync("CommentUpdated", new
							{
								commentId = comment.Id,
								action = "like"
							});
					}
				}

				if (receiverId.HasValue && message != null)
				{
					await _notificationDao.CreateNotificationAsync(receiverId.Value, message);
					await _hubContext.Clients.Group($"user_{receiverId}")
						.SendAsync("ReceiveNotification", new { message });
				}
			}

			return Ok(new { message = isLiked ? "Liked" : "Unliked" });
		}

	}

}
