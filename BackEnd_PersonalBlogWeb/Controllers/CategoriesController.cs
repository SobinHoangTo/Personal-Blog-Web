using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_PRN232_PersonalBlogWeb.DAO;
using Project_PRN232_PersonalBlogWeb.Models;

namespace Project_PRN232_PersonalBlogWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryDAO _dao;

        public CategoriesController(CategoryDAO dao)
		{
			_dao = dao;
		}

		// GET: api/Categories
		[HttpGet]
		public async Task<IActionResult> GetCategories()
		{
			var categories = await _dao.GetAllCategoriesAsync();
			return Ok(categories);
		}

		// GET: api/Categories/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Category>> GetCategory(int id)
		{
			var category = await _dao.GetCategoryByIdAsync(id);

			if (category == null)
			{
				return NotFound(new { message = "Category not found" });
			}

			return Ok(category);
		}

		// POST: api/Categories
		[HttpPost]
		public async Task<IActionResult> PostCategory(Category category)
		{
			if (category == null)
			{
				return BadRequest(new { message = "Invalid category data" });
			}

			await _dao.AddCategoryAsync(category);
			return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
		}

		// PUT: api/Categories/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutCategory(int id, Category category)
		{
			if (id != category.Id)
			{
				return BadRequest(new { message = "Category ID mismatch" });
			}

			try
			{
				await _dao.UpdateCategoryAsync(category);
			}
			catch (KeyNotFoundException)
			{
				return NotFound(new { message = "Category not found" });
			}
			catch (InvalidOperationException ex)
			{
				return Conflict(new { message = ex.Message });
			}

			return NoContent();
		}

		// DELETE: api/Categories/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCategory(int id)
		{
			try
			{
				await _dao.DeleteCategoryAsync(id);
			}
			catch (KeyNotFoundException)
			{
				return NotFound(new { message = "Category not found" });
			}

			return NoContent();
		}

	}
}
