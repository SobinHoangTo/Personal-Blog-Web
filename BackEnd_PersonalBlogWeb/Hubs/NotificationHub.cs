using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;

namespace Project_PRN232_PersonalBlogWeb.Hubs
{
	public class NotificationHub : Hub
	{
		public async Task RegisterUser(string userId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
		}

		public async Task JoinPostGroup(int postId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, $"post_{postId}");
		}

		public async Task LeavePostGroup(int postId)
		{
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"post_{postId}");
		}

		public override async Task OnDisconnectedAsync(Exception? exception)
		{
			// Optional: Remove user from group
			await base.OnDisconnectedAsync(exception);
		}
	}
}
