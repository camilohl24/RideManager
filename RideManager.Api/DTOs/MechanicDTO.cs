using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs
{
    public class MechanicResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Position { get; set; } = null!;
    }


    public class MechanicRequestDto
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        public string Phone { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Position { get; set; } = null!;
    }

}
