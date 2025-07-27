using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project_PRN232_PersonalBlogWeb.DAO;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : BaseController
    {
        private readonly NotificationDAO _notiDao;

        public NotificationsController(NotificationDAO notiDao)
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

        [HttpPost("mark-all-read")]
        [Authorize]
        public async Task<IActionResult> MarkAllAsRead()
        {
            if (!CurrentUserId.HasValue) return Unauthorized();
            await _notiDao.MarkAllAsReadAsync(CurrentUserId.Value);
            return Ok(new { message = "All marked as read" });
        }

        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            if (!CurrentUserId.HasValue) return Unauthorized();
            var result = await _notiDao.GetAllNotificationsAsync(CurrentUserId.Value);
            return Ok(result);
        }
    }
}
