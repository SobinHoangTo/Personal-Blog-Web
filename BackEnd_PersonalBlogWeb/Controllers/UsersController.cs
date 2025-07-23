using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity.Data;
using Project_PRN232_PersonalBlogWeb.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : BaseController
	{
		private readonly UserDAO _userDao;
		private readonly IConfiguration _config;
		private readonly JwtTokenHelper _jwtTokenHelper;

		public UsersController(UserDAO userDao, IConfiguration config, JwtTokenHelper jwtTokenHelper)
		{
			_userDao = userDao;
			_config = config;
			_jwtTokenHelper = jwtTokenHelper;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(UserLoginRequest req)
		{
			if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
				return BadRequest("Username and password are required.");

			var user = await _userDao.LoginAsync(req.Username, req.Password);
			if (user == null || user.Role == 99)
				return Unauthorized("Sai thông tin đăng nhập hoặc tài khoản bị chặn.");

			
			var role = user.Role.ToString();
			var userId = user.Id.ToString();
			var token = _jwtTokenHelper.GenerateToken(user);
			return Ok(new UserLoginResponse
			{
				Role = role,
				UserId = userId,
				Email = user.Email,
				FullName = user.FullName,
				Username = user.Username,
				Avatar = user.Avatar,
				AccessToken = token,
				ExpiresIn = (int)TimeSpan.FromMinutes(Convert.ToDouble(_config["Jwt:ExpirationMinutes"])).TotalSeconds
			});
		}

		[HttpGet("google-login")]
		public IActionResult GoogleLogin()
		{
			var redirectUrl = Url.Action("GoogleResponse", "Users"); // Controller name!
			var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
			return Challenge(properties, GoogleDefaults.AuthenticationScheme);
		}

		[HttpGet("google-response")]
		public async Task<IActionResult> GoogleResponse()
		{
			var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

			if (!result.Succeeded)
			{
				Console.WriteLine("Google Auth Failed:");
				foreach (var failure in result.Failure?.InnerException?.Message ?? "No inner message")
				{
					Console.WriteLine(failure);
				}
				return Unauthorized("Google authentication failed");
			}

			var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
			var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;

			// Kiểm tra trong DB nếu user đã tồn tại → trả JWT
			var user = await _userDao.GetByEmailAsync(email);
			if (user == null)
			{
				// Nếu chưa có user → tự động đăng ký
				await _userDao.RegisterAsync(new UserRegisterRequest
				{
					Username = email,
					Email = email,
					FullName = name,
					Password = Guid.NewGuid().ToString() // random
				});
				user = await _userDao.GetByEmailAsync(email);
			}

			// Sinh token JWT trả về
			var token = _jwtTokenHelper.GenerateToken(user);

			return Ok(new
			{
				message = "Login with Google success!",
				token,
				user = new UserResponse
				{
					Id = user.Id,
					Username = user.Username,
					FullName = user.FullName,
					Email = user.Email,
					Role = user.Role
				}
			});
		}


		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegisterRequest req)
		{
			if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password) || string.IsNullOrEmpty(req.Email))
				return BadRequest("Username, password, and email are required.");

			var existing = await _userDao.GetByEmailAsync(req.Email);
			if (existing != null) return BadRequest("Email already exists");

			var user = await _userDao.RegisterAsync(req);
			return Ok(user);
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPost("create")]
		public async Task<IActionResult> AddAccount([FromBody] AddAccountRequest req)
		{
			var user = await _userDao.AddAccountByAdminAsync(req);
			return Ok(user);
		}

		[Authorize]
		[HttpGet("profile")]
		public async Task<IActionResult> GetProfile()
		{
			var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var user = await _userDao.GetByIdAsync(userId);
			if (user == null) return NotFound();

			return Ok(user);
		}

		[Authorize]
		[HttpPut("update-profile")]
		public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest req)
		{
			var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var user = await _userDao.UpdateProfileAsync(userId, req);
			if (user == null) return NotFound("User not found or update failed");

			return Ok(user);
		}

		[Authorize]
		[HttpPut("change-password")]
		public async Task<IActionResult> ChangePassword([FromBody] DTO.ChangePasswordRequest req)
		{
			var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var success = await _userDao.ChangePasswordAsync(userId, req.OldPassword, req.NewPassword);
			return success ? Ok("Password changed successfully") : BadRequest("Old password is incorrect");
		}

		[Authorize]
		[HttpPut("forgot-password")]
		public async Task<IActionResult> ForgotPassword([FromBody] DTO.ForgotPasswordRequest req)
		{
			var success = await _userDao.ResetPasswordAsync(req.Email, req.NewPassword);
			return success ? Ok("Password reset") : NotFound("Email not found");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpDelete("delete-user/{id}")]
		public async Task<IActionResult> DeleteUser(int id)
		{
			var success = await _userDao.DeleteUserAsync(id);
			if (!success) return BadRequest("Không thể xóa user.");
			return Ok("Xóa thành công hoặc đã bị chặn.");
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetUser(int id)
		{
			var user = await _userDao.GetByIdAsync(id);
			return user == null ? NotFound() : Ok(user);
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			return Ok(await _userDao.GetAllAsync());
		}
	}

}
