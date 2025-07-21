using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{

	[ApiController]
	public class BaseController : ControllerBase
	{
		protected int? CurrentUserId
		{
			get
			{
				var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
				return idClaim != null ? int.Parse(idClaim.Value) : (int?)null;
			}
		}

		protected int? CurrentUserRole
		{
			get
			{
				var roleClaim = User.FindFirst(ClaimTypes.Role);
				return roleClaim != null ? int.Parse(roleClaim.Value) : (int?)null;
			}
		}

		protected bool IsAdmin => CurrentUserRole == 0;
		protected bool IsStaff => CurrentUserRole == 2;
		protected bool IsAuthor => CurrentUserRole == 1;
		protected bool IsBlocked => CurrentUserRole == 99;

		protected bool IsOwner(int? resourceOwnerId)
		{
			return CurrentUserId == resourceOwnerId;
		}
	}
}
