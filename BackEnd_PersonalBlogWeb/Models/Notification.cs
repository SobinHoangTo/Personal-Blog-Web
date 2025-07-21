using System;
using System.Collections.Generic;

namespace Project_PRN232_PersonalBlogWeb.Models;

public partial class Notification
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Message { get; set; }

    public bool IsRead { get; set; }

    public virtual User? User { get; set; }
}
