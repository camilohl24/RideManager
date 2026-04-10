using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace RideManager.Api.Models;

[Index(nameof(DocumentId), IsUnique = true)]
public class Owner
{
    [Required]
    public string DocumentId { get; set; } = null!;

    [Required]
    public string Email { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    public int Id { get; set; }

    [Required]
    public string LastName { get; set; } = null!;

    public List<Motorcycle> Motorcycles { get; set; } = new();

    [Required]
    public string Phone { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}