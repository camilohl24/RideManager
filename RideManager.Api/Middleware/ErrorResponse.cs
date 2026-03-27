namespace RideManager.Api.Middleware;

public class ErrorResponse
{
    public string Message { get; set; } = null!;
    public int Status { get; set; }
}