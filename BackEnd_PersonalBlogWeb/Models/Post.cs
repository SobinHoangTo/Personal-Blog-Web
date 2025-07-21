using System;
using System.Collections.Generic;

namespace Project_PRN232_PersonalBlogWeb.Models;

public partial class Post
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int? AuthorId { get; set; }

    public int? CategoryId { get; set; }

    public DateTime CreatedDate { get; set; }

    public string? CoverImage { get; set; }

    public byte Status { get; set; }

    public virtual User? Author { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
}
