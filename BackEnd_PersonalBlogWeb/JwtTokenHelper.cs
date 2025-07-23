using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Project_PRN232_PersonalBlogWeb.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project_PRN232_PersonalBlogWeb.Helpers
{
	public class JwtTokenHelper
	{
		private readonly IConfiguration _configuration;

		public JwtTokenHelper(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public string GenerateToken(User user)
		{
			var Jwt = _configuration.GetSection("Jwt");
			var secretKeyValue = Jwt["SecretKey"];

			if (string.IsNullOrEmpty(secretKeyValue))
			{
				throw new InvalidOperationException("JWT SecretKey is not configured in appsettings.json");
			}

			var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKeyValue));
			var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Name, user.Username ?? string.Empty),
				new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
				new Claim(ClaimTypes.GivenName, user.FullName ?? string.Empty),
				new Claim(ClaimTypes.Role, user.Role?.ToString() ?? "0"),
				new Claim("avatar", user.Avatar ?? string.Empty)
			};

			var token = new JwtSecurityToken(
				issuer: Jwt["Issuer"],
				audience: Jwt["Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(Jwt["ExpirationMinutes"])),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
