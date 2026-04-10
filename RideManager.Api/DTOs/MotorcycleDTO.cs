using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class MotorcycleResponseDto
{
    public string Brand { get; set; } = null!;
    public int Id { get; set; }
    public string LicensePlate { get; set; } = null!;
    public int Model { get; set; }
    public int OwnerId { get; set; }
    public string OwnerName { get; set; } = null!;
    public string Reference { get; set; } = null!;
    public List<int>? WorkOrdersId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MotorcycleRequestDto
{
    public string Brand { get; set; } = null!;
    public string LicensePlate { get; set; } = null!;
    public int Model { get; set; }
    public int OwnerId { get; set; }
    public string Reference { get; set; } = null!;
}