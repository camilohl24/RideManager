using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class MotorcycleResponseDto
{ 
    public int Id { get; set; }
    public string LicensePlate { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public string Model { get; set; } = null!;
    public string Reference { get; set; } = null!;
    public string OwnerName { get; set; } = null!;
    public int OwnerId { get; set; }
    public List<int>? WorkOrdersId { get; set; }
}

public class MotorcycleRequestDto
{
    [Required]
    public string LicensePlate { get; set; } = null!;
    [Required]
    public string Brand { get; set; } = null!;
    [Required]
    public string Model { get; set; } = null!;
    [Required]
    public string Reference { get; set; } = null!;
    [Required]
    public int OwnerId { get; set; }

}
