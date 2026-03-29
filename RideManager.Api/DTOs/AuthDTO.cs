using RideManager.Api.Models;

namespace RideManager.Api.DTOs;

public record RegisterDto(string UserName, string Password, UserRole Role);
public record LoginDto(string UserName, string Password);
public record TokenResponseDto(string Token);