using System;
using System.Collections.Generic;

namespace Project_PRN232_PersonalBlogWeb.Models;

public partial class User
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public int? Role { get; set; }

    public string? Avatar { get; set; }

    public string? Bio { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
