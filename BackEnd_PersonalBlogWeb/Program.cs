using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.Helpers;
using Project_PRN232_PersonalBlogWeb.Hubs;
using Project_PRN232_PersonalBlogWeb.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

namespace Project_PRN232_PersonalBlogWeb
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Load configuration
			IConfiguration configuration = new ConfigurationBuilder()
				.SetBasePath(Directory.GetCurrentDirectory())
				.AddJsonFile("appsettings.json", true, true)
				.Build();

			var Jwt = configuration.GetSection("Jwt");

			// ============================================
			// Add Services
			// ============================================

			builder.Services.AddControllers()
				.AddJsonOptions(options =>
				{
					options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
					options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
				});

			builder.Services.AddDbContext<PersonalBlogWebContext>(options =>
				options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

			// Add CORS
			// builder.Services.AddCors(options =>
			// {
			// 	options.AddPolicy("AllowLocalhost", builder =>
			// 	{
			// 		builder
			// 			.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://127.0.0.1:3000")
			// 			.AllowAnyMethod()
			// 			.AllowAnyHeader()
			// 			.AllowCredentials();
			// 	});
			// });
			builder.Services.AddCors(options =>
			{
				options.AddDefaultPolicy(policy =>
				{
					policy.AllowAnyOrigin()
						  .AllowAnyHeader()
						  .AllowAnyMethod();
				});
			});



			// Register DAOs
			builder.Services.AddScoped<PostDAO>();
			builder.Services.AddScoped<CategoryDAO>();
			builder.Services.AddScoped<UserDAO>();
			builder.Services.AddScoped<CommentDAO>();
			builder.Services.AddScoped<LikeDAO>();
			builder.Services.AddScoped<NotificationDAO>();

			// HttpContext, Session
			builder.Services.AddHttpContextAccessor();
			builder.Services.AddDistributedMemoryCache();
			builder.Services.AddSession();

			// SignalR
			builder.Services.AddSignalR();

			// Authentication: JWT + Google
			builder.Services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.SaveToken = true;
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = Jwt["Issuer"],
					ValidAudience = Jwt["Audience"],
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwt["SecretKey"]))
				};
			})
			.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
			.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
			{
				options.ClientId = configuration["GoogleKeys:ClientId"];
				options.ClientSecret = configuration["GoogleKeys:ClientSecret"];
				options.CallbackPath = "/signin-google";
			});

			// ============================================
			// Swagger + JWT Config
			// ============================================
			// Add Swagger JWT configuration
			builder.Services.AddSwaggerGen(c =>
			{
				var jwtSecurityScheme = new OpenApiSecurityScheme
				{
					Name = "JWT Authentication",
					Description = "JWT Authentication for Cosmetics Management",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.Http,
					Scheme = "Bearer",
					BearerFormat = "JWT"
				};

				c.AddSecurityDefinition("Bearer", jwtSecurityScheme);

				var securityRequirement = new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							}
						},
						new string[] {}
					}
				};

				c.AddSecurityRequirement(securityRequirement);
			});

			// Authorization Policies (if needed)
			builder.Services.AddAuthorization(options =>
			{
				// ✅ Role = 0 → Admin
				options.AddPolicy("AdminOnly", policy =>
					policy.RequireClaim(ClaimTypes.Role, "0"));

				// ✅ Role = 0 (Admin), 1 (Staff), 2 (Member)
				options.AddPolicy("AdminOrStaffOrMember", policy =>
					policy.RequireAssertion(context =>
						context.User.HasClaim(claim => claim.Type == ClaimTypes.Role) &&
						(new[] { "0", "1", "2" }).Contains(context.User.FindFirstValue(ClaimTypes.Role))
					));

				// ✅ Role = 1 (Staff), 2 (Member)
				options.AddPolicy("StaffOrMember", policy =>
					policy.RequireAssertion(context =>
						context.User.HasClaim(claim => claim.Type == ClaimTypes.Role) &&
						(new[] { "1", "2" }).Contains(context.User.FindFirstValue(ClaimTypes.Role))
					));
			});

			builder.Services.AddScoped<JwtTokenHelper>();

			// ============================================
			// Build & Configure
			// ============================================
			var app = builder.Build();

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();
			app.UseRouting();

			app.UseCors(); // trước app.UseAuthorization();
			app.UseAuthentication();
			app.UseAuthorization();

			app.MapControllers();

			// app.MapHub<YourHub>("/your-hub"); // optional SignalR hub
			app.MapHub<NotificationHub>("/hub/notification");

			app.Run();
		}
	}
}
