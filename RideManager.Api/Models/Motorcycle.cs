using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.Models;

public class Motorcycle
{
    public int Id{ get; set; }
    [Required]
    public string LicensePlate { get; set; } = null!;
    [Required]
    public string Brand { get; set; } = null!;
    [Required]
    public string Model { get; set; } = null!;
    [Required]
    public string Reference { get; set; } = null!;

    public int OwnerId { get; set; }

    public Owner Owner { get; set; } = null!;


    public List<WorkOrder> WorkOrders { get; set; } = new();

}
