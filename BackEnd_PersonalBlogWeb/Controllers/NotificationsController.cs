using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.Models;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
		[ApiController]
		[Route("api/[controller]")]
		public class NotificationController : BaseController
		{
			private readonly NotificationDAO _notiDao;

			public NotificationController(NotificationDAO notiDao)
			{
				_notiDao = notiDao;
			}

			[HttpGet("unread")]
			[Authorize]
			public async Task<IActionResult> GetUnread()
			{
				if (!CurrentUserId.HasValue) return Unauthorized();
				var result = await _notiDao.GetUnreadNotificationsAsync(CurrentUserId.Value);
				return Ok(result);
			}

			[HttpPut("read/{id}")]
			[Authorize]
			public async Task<IActionResult> MarkAsRead(int id)
			{
				if (!CurrentUserId.HasValue) return Unauthorized();
				await _notiDao.MarkAsReadAsync(id, CurrentUserId.Value);
				return Ok(new { message = "Marked as read" });
			}

			[HttpPut("read-all")]
			[Authorize]
			public async Task<IActionResult> MarkAllAsRead()
			{
				if (!CurrentUserId.HasValue) return Unauthorized();
				await _notiDao.MarkAllAsReadAsync(CurrentUserId.Value);
				return Ok(new { message = "All marked as read" });
			}
		}
	}
}
