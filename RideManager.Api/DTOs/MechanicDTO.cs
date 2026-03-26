using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs
{
    public class MechanicRequestDto
    {
        public string DocumentId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Phone { get; set; } = null!;

        [Required]
        public string Position { get; set; } = null!;
    }

    public class MechanicResponseDto
    {
        public string DocumentId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public int Id { get; set; }
        public string Phone { get; set; } = null!;
        public string Position { get; set; } = null!;
    }
}