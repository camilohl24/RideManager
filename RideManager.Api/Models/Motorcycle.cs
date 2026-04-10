using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.Models;

[Index(nameof(LicensePlate), IsUnique = true)]
public class Motorcycle
{
    [Required]
    public string Brand { get; set; } = null!;

    public int Id { get; set; }

    [Required]
    public string LicensePlate { get; set; } = null!;

    [Required]
    public int Model { get; set; }

    public Owner? Owner { get; set; }

    public int OwnerId { get; set; }

    [Required]
    public string Reference { get; set; } = null!;

    public List<WorkOrder> WorkOrders { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}