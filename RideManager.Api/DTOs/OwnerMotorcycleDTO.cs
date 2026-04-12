namespace RideManager.Api.DTOs;

public class OwnerMotorcycleDTO
{
    public string Brand { get; set; } = null!;
    public string Reference { get; set; } = null!;
    public int Model { get; set; }
    public string LicensePlate { get; set; } = null!;
}
