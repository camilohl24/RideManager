using RideManager.Api.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RideManager.Api.DTOs;

public class WorkOrderResponseDto
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public string Diagnosis { get; set; } = null!;
    public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; }
    public decimal Cost { get; set; }
    public List<int> NotesId { get; set; } = new();
    public string LicensePlate { get; set; } = null!;
    public string FullNameMechanic { get; set; } = null!;

}

public class WorkOrderRequestDto
{
    [Required]
    public string Description { get; set; } = null!;

    [Required]
    public string Diagnosis { get; set; } = null!;
    public WorkOrderStatus Status { get; set; } = WorkOrderStatus.Pending;
    public decimal Cost { get; set; }
    [Required]
    public int  MotorcycleId { get; set; }
    [Required]
    public int MechanicId { get; set; }
}