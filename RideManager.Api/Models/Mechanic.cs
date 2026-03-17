using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.Models
{
    public class Mechanic
    {
        public int Id { get; set; }
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
