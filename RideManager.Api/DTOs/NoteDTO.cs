using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class NoteResponseDto
{
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Description { get; set; } = null!;
    public int Id { get; set; }
    public int WorkOrderId { get; set; }
}

public class NoteRequestDto
{
    public string Description { get; set; } = null!;
    public int WorkOrderId { get; set; }
}