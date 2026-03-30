using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.Models
{
    public class Appointment
    {
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Id { get; set; }
        public Mechanic? Mechanic { get; set; }
        public int? MechanicId { get; set; }
        public Motorcycle? Motorcycle { get; set; }
        public int? MotorcycleId { get; set; }
        public Owner? Owner { get; set; }
        public int? OwnerId { get; set; }

        [Required]
        public string Reason { get; set; } = null!;

        public DateTime? ScheduledAt { get; set; }
        public AppointmentStatus Status { get; set; }
        public int TurnNumber { get; set; }
        public AppointmentType Type { get; set; }
    }
}