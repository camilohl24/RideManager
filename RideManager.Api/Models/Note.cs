using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.Models;

public class Note
{
    public int Id { get; set; }
    [Required]
    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int WorkOrderId { get; set; }
    public WorkOrder WorkOrder { get; set; } = null!;
}
