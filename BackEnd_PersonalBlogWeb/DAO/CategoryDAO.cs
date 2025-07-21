using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.Models;

namespace Project_PRN232_PersonalBlogWeb.DAO
{
	public class CategoryDAO
	{
		private readonly PersonalBlogWebContext _context;

		public CategoryDAO(PersonalBlogWebContext context)
		{
			_context = context;
		}
		public async Task<List<Category>> GetAllCategoriesAsync()
		{
			return await _context.Categories.ToListAsync();
		}
		public async Task<Category?> GetCategoryByIdAsync(int id)
		{
			return await _context.Categories.FindAsync(id);
		}

		public async Task AddCategoryAsync(Category category)
		{
			if (category == null)
			{
				throw new ArgumentNullException(nameof(category), "Category cannot be null");
			}
			var isNameExists = await _context.Categories.AnyAsync(c => c.Name == category.Name);
			if (isNameExists)
			{
				throw new InvalidOperationException($"Category with name '{category.Name}' already exists.");
			}
			if (string.IsNullOrWhiteSpace(category.Name))
			{
				throw new ArgumentException("Category name cannot be null or empty", nameof(category.Name));
			}
			_context.Categories.Add(category);
			await _context.SaveChangesAsync();
		}

		public async Task UpdateCategoryAsync(Category category)
		{
			if (category == null)
			{
				throw new ArgumentNullException(nameof(category), "Category cannot be null");
			}
			var existingCategory = await _context.Categories.FindAsync(category.Id);
			if (existingCategory == null)
			{
				throw new KeyNotFoundException($"Category with ID {category.Id} not found");
			}
			var isNameExists = await _context.Categories.AnyAsync(c => c.Name == category.Name && c.Id != category.Id);
			if (isNameExists)
			{
				throw new InvalidOperationException($"Category with name '{category.Name}' already exists.");
			}
			if (string.IsNullOrWhiteSpace(category.Name))
			{
				throw new ArgumentException("Category name cannot be null or empty", nameof(category.Name));
			}
			existingCategory.Name = category.Name;
			existingCategory.Description = category.Description;
			_context.Categories.Update(existingCategory);
			await _context.SaveChangesAsync();
		}

		public async Task DeleteCategoryAsync(int id)
		{
			var category = await _context.Categories.FindAsync(id);
			if (category == null)
			{
				throw new KeyNotFoundException($"Category with ID {id} not found");
			}
			if (category.Posts != null && category.Posts.Any())
			{
				throw new InvalidOperationException($"Cannot delete category with ID {id} because it has associated posts.");
			}
			_context.Categories.Remove(category);
			await _context.SaveChangesAsync();
		}
	}
}
