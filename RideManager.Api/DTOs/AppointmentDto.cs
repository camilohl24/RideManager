using RideManager.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class AppointmentResponseDto
{
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? FullNameMechanic { get; set; }
    public string? FullNameOwner { get; set; }
    public int Id { get; set; }
    public string? LicensePlate { get; set; }
    public string Reason { get; set; } = null!;
    public DateTime? ScheduledAt { get; set; }
    public AppointmentStatus Status { get; set; }
    public int TurnNumber { get; set; }
    public AppointmentType Type { get; set; }
}

public class AppointmentRequestDto
{
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public int? MechanicId { get; set; }
    public int? MotorcycleId { get; set; }
    public int? OwnerId { get; set; }
    public string Reason { get; set; } = null!;
    public DateTime? ScheduledAt { get; set; }
    public AppointmentType Type { get; set; }
}