using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RideManager.Api.Models;

public class WorkOrder
{
    public int Id { get; set; }
    [Required]
    public string Description { get; set; } = null!;
    [Required]
    public string Diagnosis { get; set; } = null!;
    public WorkOrderStatus Status { get; set; }  = WorkOrderStatus.Pending;
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; } 
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Cost { get; set; }
    public List<Note> Notes { get; set; } = new();
    public int MotorcycleId { get; set; } 
    public Motorcycle Motorcycle { get; set; } = null!;
    public int MechanicId { get; set; }
    public Mechanic Mechanic { get; set; } = null!;


}