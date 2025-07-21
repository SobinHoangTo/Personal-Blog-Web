using System;
using System.Collections.Generic;

namespace Project_PRN232_PersonalBlogWeb.Models;

public partial class Comment
{
    public int Id { get; set; }

    public int? PostId { get; set; }

    public int? UserId { get; set; }

    public string Content { get; set; } = null!;

    public int? ParentCommentId { get; set; }

    public virtual ICollection<Comment> InverseParentComment { get; set; } = new List<Comment>();

    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();

    public virtual Comment? ParentComment { get; set; }

    public virtual Post? Post { get; set; }

    public virtual User? User { get; set; }
}
