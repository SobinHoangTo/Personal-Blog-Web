using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using System;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class NotificationDAO
	{
		private readonly PersonalBlogWebContext _context;

		public NotificationDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}

		public async Task<Notification> CreateNotificationAsync(int? userId, string message)
		{
			var noti = new Notification
			{
				UserId = userId,
				Message = message
			};

			_context.Notifications.Add(noti);
			await _context.SaveChangesAsync();
			return noti;
		}

		public async Task<List<NotificationDto>> GetUnreadNotificationsAsync(int userId)
		{
			return await _context.Notifications
				.Where(n => n.UserId == userId && !n.IsRead)
				.OrderByDescending(n => n.Id)
				.Select(n => new NotificationDto
				{
					Id = n.Id,
					Message = n.Message,
					IsRead = n.IsRead,
				})
				.ToListAsync();
		}

		public async Task MarkAsReadAsync(int id, int userId)
		{
			var noti = await _context.Notifications
				.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

			if (noti != null)
			{
				noti.IsRead = true;
				await _context.SaveChangesAsync();
			}
		}

		public async Task MarkAllAsReadAsync(int userId)
		{
			var unread = await _context.Notifications
				.Where(n => n.UserId == userId && !n.IsRead)
				.ToListAsync();

			foreach (var n in unread)
			{
				n.IsRead = true;
			}

			await _context.SaveChangesAsync();
		}

		public async Task<List<NotificationDto>> GetAllNotificationsAsync(int userId)
		{
			return await _context.Notifications
				.Where(n => n.UserId == userId)
				.OrderByDescending(n => n.Id)
				.Select(n => new NotificationDto
				{
					Id = n.Id,
					Message = n.Message,
					IsRead = n.IsRead,
				})
				.ToListAsync();
		}
	}

}
