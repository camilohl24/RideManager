using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.Models;

namespace RideManager.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.UserName, u.Role })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UserRole role)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return NotFound();

        user.Role = role;
        await _context.SaveChangesAsync();

        return Ok("Rol actualizado correctamente.");
    }
    [HttpPut("{id}/username")]
    public async Task<IActionResult> UpdateUsername(int id, [FromBody] string newUsername)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return NotFound();

        bool exists = await _context.Users.AnyAsync(u => u.UserName == newUsername && u.Id != id);
        if (exists) return BadRequest("Ese nombre de usuario ya está en uso.");

        user.UserName = newUsername;
        await _context.SaveChangesAsync();

        return Ok("Usuario actualizado correctamente.");
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] string newPassword)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return NotFound();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();

        return Ok("Contraseña actualizada correctamente.");
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("Usuario eliminado correctamente.");
    }
}