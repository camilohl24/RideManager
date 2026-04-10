namespace RideManager.Api.Models;

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public UserRole Role {  get; set; } = UserRole.Mechanic;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
