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
			var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwt["Jwt"]));
			var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.Role, user.Role.ToString())
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
