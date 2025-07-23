using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
	public class CommentController : BaseController
	{
		private readonly CommentDAO _commentDao;
		private readonly PostDAO _postDao;
		private readonly NotificationDAO _notificationDao;
		private readonly IHubContext<NotificationHub> _hubContext;

		public CommentController(CommentDAO commentDao, PostDAO postDao,
			NotificationDAO notificationDao, IHubContext<NotificationHub> hubContext)
		{
			_commentDao = commentDao;
			_postDao = postDao;
			_notificationDao = notificationDao;
			_hubContext = hubContext;
		}

		// GET: api/Comment/post/5
		[HttpGet("post/{postId}")]
		public async Task<IActionResult> GetCommentsByPostId(int postId)
		{
			// Get current user ID if authenticated
			int? currentUserId = CurrentUserId;

			var comments = await _commentDao.GetCommentsByPostIdAsync(postId, currentUserId);
			if (comments == null || !comments.Any())
			{
				return NotFound(new { message = "No comments found for this post." });
			}
			return Ok(comments);
		}       // POST: api/Comment
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> AddComment([FromBody] CreateCommentDto dto)
		{
			if (IsBlocked) return Forbid();
			if (!CurrentUserId.HasValue) return Unauthorized();

			var comment = await _commentDao.AddCommentAsync(dto, CurrentUserId.Value);

			string? message = null;
			int? receiverId = null;

			if (dto.ParentCommentId.HasValue)
			{
				// Reply to a comment
				var parentComment = await _commentDao.GetCommentByIdAsync(dto.ParentCommentId.Value);
				if (parentComment != null && parentComment.UserId != CurrentUserId)
				{
					receiverId = parentComment.UserId;
					message = $"{User.Identity!.Name} đã trả lời bình luận của bạn.";
				}
			}
			else
			{
				// Comment on a post
				var post = await _postDao.GetPostByIdAsync(dto.PostId);
				if (post != null && post.AuthorID != CurrentUserId)
				{
					receiverId = post.AuthorID;
					message = $"{User.Identity!.Name} đã bình luận bài viết của bạn.";
				}
			}

			await _hubContext.Clients.Group($"post_{dto.PostId}")
			.SendAsync("CommentAdded", new
			{
				postId = dto.PostId,
				commentId = comment.Id,
				parentId = dto.ParentCommentId,
				content = comment.Content,
				author = User.Identity.Name
			});


			if (receiverId.HasValue && message != null)
			{
				await _notificationDao.CreateNotificationAsync(receiverId.Value, message);
				await _hubContext.Clients.Group($"user_{receiverId}")
					.SendAsync("ReceiveNotification", new { message });
			}

			return Ok(new { message = "Comment added", commentId = comment.Id });
		}

		// PUT: api/Comment
		[Authorize]
		[HttpPut]
		public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentDto dto)
		{
			var comment = await _commentDao.GetCommentByIdAsync(dto.CommentId);
			if (comment == null)
				return NotFound(new { message = "Comment not found" });

			if (!IsOwner(comment.UserId))
				return Forbid();

			var success = await _commentDao.UpdateCommentAsync(dto.CommentId, dto.Content);

			if (success)
			{
				await _hubContext.Clients.Group($"post_{comment.PostId}")
					.SendAsync("CommentUpdated", new
					{
						commentId = comment.Id,
						action = "update",
						newContent = dto.Content
					});

				return Ok(new { message = "Comment updated" });
			}
			else
			{
				return StatusCode(500, new { message = "Failed to update comment" });
			}
		}

		// DELETE: api/Comment/{id}
		[Authorize]
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteComment(int id)
		{
			var comment = await _commentDao.GetCommentByIdAsync(id);
			if (comment == null)
				return NotFound(new { message = "Comment not found" });

			if (!IsOwner(comment.UserId) && !IsAdmin && !IsStaff)
				return Forbid();

			var success = await _commentDao.DeleteCommentAsync(id);

			if (success)
			{
				await _hubContext.Clients.Group($"post_{comment.PostId}")
					.SendAsync("CommentUpdated", new
					{
						commentId = comment.Id,
						action = "delete"
					});

				return Ok(new { message = "Comment deleted" });
			}
			else
			{
				return StatusCode(500, new { message = "Failed to delete comment" });
			}
		}
	}
}