using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class NoteResponseDto
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int WorkOrderId { get; set; } 
}

public class NoteRequestDto
{
    [Required]
    public string Description { get; set; } = null!;
    [Required]
    public int WorkOrderId { get; set; }
}
