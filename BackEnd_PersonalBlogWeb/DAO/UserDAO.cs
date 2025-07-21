using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Project_PRN232_PersonalBlogWeb.DTO;
using Project_PRN232_PersonalBlogWeb.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class UserDAO
	{
		private readonly PersonalBlogWebContext _context;

		public UserDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}

		public async Task<User?> GetByUsernameAsync(string username)
		{
			return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
		}

		public async Task<User?> GetByEmailAsync(string email)
		{
			return await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
		}

		public async Task<List<UserResponse>> GetAllAsync()
		{
			return await _context.Users
				.Where(u => u.Role != 99) // exclude deleted/locked users
				.Select(u => new UserResponse
				{
					Id = u.Id,
					Username = u.Username,
					FullName = u.FullName,
					Email = u.Email,
					Avatar = u.Avatar,
					Bio = u.Bio,
					Role = u.Role
				})
				.ToListAsync();
		}

		public async Task<User?> GetByIdAsync(int id)
		{
			return await _context.Users.FindAsync(id);
		}

		public async Task<User?> LoginAsync(string username, string password)
		{
			var user = await GetByUsernameAsync(username);
			if (user == null || user.Role == 99) return null;

			return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) ? user : null;
		}

		public async Task<User?> RegisterAsync(UserRegisterRequest req)
		{
			if (await _context.Users.AnyAsync(u =>
				u.Username.ToLower() == req.Username.ToLower()
				|| u.Email.ToLower() == req.Email.ToLower())) return null;

			var user = new User
			{
				Username = req.Username,
				FullName = req.FullName,
				Email = req.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
				Role = 1
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			return user;
		}

		public async Task<bool> ResetPasswordAsync(string email, string newPassword)
		{
			var user = await GetByEmailAsync(email);
			if (user == null) return false;

			user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
		{
			var user = await GetByIdAsync(userId);
			if (user == null || !BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash)) return false;

			user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<User?> AddAccountByAdminAsync(AddAccountRequest req)
		{
			if (await _context.Users.AnyAsync(u => u.Username == req.Username || u.Email == req.Email)) return null;

			var user = new User
			{
				Username = req.Username,
				FullName = req.FullName,
				Email = req.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
				Role = 2 // default: Staff
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			return user;
		}

		public async Task<bool> UpdateProfileAsync(int userId, UpdateUserRequest req)
		{
			var user = await GetByIdAsync(userId);
			if (user == null) return false;

			user.FullName = req.FullName;
			user.Avatar = req.Avatar;
			user.Bio = req.Bio;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> DeleteUserAsync(int id)
		{
			var user = await GetByIdAsync(id);
			if (user == null) return false;

			bool hasPosts = await _context.Posts.AnyAsync(p => p.AuthorId == id);
			bool hasComments = await _context.Comments.AnyAsync(c => c.UserId == id);
			bool hasLikes = await _context.Likes.AnyAsync(l => l.UserId == id);

			if (hasPosts || hasComments || hasLikes)
			{
				user.Role = 99; // mark as deleted/locked
			}
			else
			{
				_context.Users.Remove(user);
			}

			await _context.SaveChangesAsync();
			return true;
		}
	}
}
