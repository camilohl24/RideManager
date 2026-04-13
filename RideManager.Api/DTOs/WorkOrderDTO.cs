using RideManager.Api.Models;

namespace RideManager.Api.DTOs;

public class WorkOrderResponseDto
{
    public DateTime? CompletedAt { get; set; }
    public decimal Cost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Description { get; set; } = null!;
    public string Diagnosis { get; set; } = null!;
    public string FullNameMechanic { get; set; } = null!;
    public int Id { get; set; }
    public string LicensePlate { get; set; } = null!;
    public List<int> NotesId { get; set; } = new();
    public string OwnerName { get; set; } = null!;
    public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Pending;
}

public class WorkOrderRequestDto
{
    public decimal Cost { get; set; }
    public string Description { get; set; } = null!;
    public string Diagnosis { get; set; } = null!;
    public int MechanicId { get; set; }
    public int MotorcycleId { get; set; }
    public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Pending;
}