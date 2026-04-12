using System.ComponentModel.DataAnnotations;

namespace RideManager.Api.DTOs;

public class OwnerResponseDto
{
    public string DocumentId { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public int Id { get; set; }
    public string Phone { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<OwnerMotorcycleDTO>? Motorcycles { get; set; }
   

public class OwnerRequestDto
{
    public string DocumentId { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Phone { get; set; } = null!;
}