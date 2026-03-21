using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class OwnerResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; }= null!;
    public List<string> LicensePlates { get; set; }

}

public class OwnerRequestDto
{
    [Required]
    public string FirstName { get; set; } = null!;
    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public string Phone { get; set; } = null!;
    [Required]
    public string Email { get; set; } = null!;
}
