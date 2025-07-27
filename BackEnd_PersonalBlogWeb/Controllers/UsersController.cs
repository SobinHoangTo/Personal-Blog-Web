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
			{
				// Display error message
				ModelState.AddModelError(string.Empty, "Wrong login information or account is blocked.");
				return Unauthorized(ModelState);
			}

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
			var redirectUrl = Url.Action("GoogleResponse", "Users");
			var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
			return Challenge(properties, GoogleDefaults.AuthenticationScheme);
		}

		[HttpGet("google-response")]
		public async Task<IActionResult> GoogleResponse()
		{
			// Use Google authentication scheme to get the result
			var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

			if (!result.Succeeded)
			{
				Console.WriteLine("Google Auth Failed:");
				foreach (var failure in result.Failure?.InnerException?.Message ?? "No inner message")
				{
					Console.WriteLine(failure);
				}

				// Redirect to frontend with error
				var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
				var errorUrl = $"{frontendUrl}/auth/google/callback?error={Uri.EscapeDataString("Google authentication failed")}";
				return Redirect(errorUrl);
			}

			var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
			var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;

			// Debug: Log all claims to see what Google is actually sending
			Console.WriteLine("=== Google OAuth Claims ===");
			foreach (var claim in result.Principal.Claims)
			{
				Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
			}

			// Try to get picture from Google API using access token
			string? picture = null;
			try
			{
				var accessToken = await HttpContext.GetTokenAsync(GoogleDefaults.AuthenticationScheme, "access_token");
				if (!string.IsNullOrEmpty(accessToken))
				{
					using var httpClient = new HttpClient();
					var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v1/userinfo?access_token={accessToken}");
					if (response.IsSuccessStatusCode)
					{
						var userInfo = await response.Content.ReadAsStringAsync();
						var userInfoJson = System.Text.Json.JsonDocument.Parse(userInfo);
						if (userInfoJson.RootElement.TryGetProperty("picture", out var pictureElement))
						{
							picture = pictureElement.GetString();
						}
					}
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error getting picture from Google API: {ex.Message}");
			}

			Console.WriteLine($"Picture URL found: {picture ?? "NULL"}");

			if (string.IsNullOrEmpty(email))
			{
				var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
				var errorUrl = $"{frontendUrl}/auth/google/callback?error={Uri.EscapeDataString("Unable to retrieve email from Google")}";
				return Redirect(errorUrl);
			}

			try
			{
				// Kiểm tra trong DB nếu user đã tồn tại → trả JWT
				var user = await _userDao.GetByEmailAsync(email);
				if (user == null)
				{
					// Nếu chưa có user → tự động đăng ký với avatar từ Google
					await _userDao.RegisterAsync(new UserRegisterRequest
					{
						Username = email,
						Email = email,
						FullName = name ?? email,
						Password = Guid.NewGuid().ToString() // random
					});
					user = await _userDao.GetByEmailAsync(email);

					// Cập nhật avatar từ Google nếu có
					if (user != null && !string.IsNullOrEmpty(picture))
					{
						await _userDao.UpdateProfileAsync(user.Id, new UpdateUserRequest
						{
							FullName = user.FullName,
							Avatar = picture,
							Bio = user.Bio
						});
						user = await _userDao.GetByEmailAsync(email); // Refresh user data
					}
				}
				else
				{
					// User đã tồn tại, cập nhật avatar từ Google nếu chưa có hoặc khác
					if (!string.IsNullOrEmpty(picture) && user.Avatar != picture)
					{
						await _userDao.UpdateProfileAsync(user.Id, new UpdateUserRequest
						{
							FullName = user.FullName,
							Avatar = picture,
							Bio = user.Bio
						});
						user = await _userDao.GetByEmailAsync(email); // Refresh user data
					}
				}

				if (user == null)
				{
					var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
					var errorUrl = $"{frontendUrl}/auth/google/callback?error={Uri.EscapeDataString("Failed to create or retrieve user account")}";
					return Redirect(errorUrl);
				}

				// Sinh token JWT trả về
				var token = _jwtTokenHelper.GenerateToken(user);

				// Redirect to frontend callback page with authentication data
				var frontendUrl2 = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
				var callbackUrl = $"{frontendUrl2}/auth/google/callback?token={Uri.EscapeDataString(token)}&userId={user.Id}&role={user.Role}";

				return Redirect(callbackUrl);
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Google login error: {ex.Message}");
				var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
				var errorUrl = $"{frontendUrl}/auth/google/callback?error={Uri.EscapeDataString("An error occurred during authentication")}";
				return Redirect(errorUrl);
			}
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
			var success = await _userDao.UpdateProfileAsync(userId, req);
			if (!success) return NotFound("User not found or update failed");

			// Return the updated user
			var updatedUser = await _userDao.GetByIdAsync(userId);
			return Ok(updatedUser);
		}

		[Authorize]
		[HttpPut("change-password")]
		public async Task<IActionResult> ChangePassword([FromBody] DTO.ChangePasswordRequest req)
		{
			var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var success = await _userDao.ChangePasswordAsync(userId, req.OldPassword, req.NewPassword);
			return success ? Ok("Password changed successfully") : BadRequest("Old password is incorrect");
		}

		[HttpPut("forgot-password")]
		public async Task<IActionResult> ForgotPassword([FromBody] DTO.ForgotPasswordRequest req)
		{
			var success = await _userDao.ResetPasswordAsync(req.Email, req.NewPassword);
			return success ? Ok("Password reset") : NotFound("Email not found");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPut("ban/{id}")]
		public async Task<IActionResult> BanUser(int id)
		{
			var success = await _userDao.BanUserAsync(id);
			if (!success) return BadRequest("Không thể ban user.");
			return Ok("User banned.");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpPut("unban/{id}")]
		public async Task<IActionResult> UnbanUser(int id)
		{
			var success = await _userDao.UnbanUserAsync(id);
			if (!success) return BadRequest("Không thể unban user.");
			return Ok("User unbanned.");
		}

		[Authorize(Policy = "AdminOnly")]
		[HttpDelete("delete-user/{id}")]
		public async Task<IActionResult> DeleteUser(int id)
		{
			var success = await _userDao.DeleteUserAsync(id);
			if (!success) return BadRequest("Không thể xóa user (user has posts, comments, or likes).");
			return Ok("User deleted.");
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

		[HttpGet("search")]
		public async Task<IActionResult> SearchUsers([FromQuery] string query)
		{
			var users = await _userDao.SearchUsersAsync(query);
			return Ok(users);
		}
	}

}
