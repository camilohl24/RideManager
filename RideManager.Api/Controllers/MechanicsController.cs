using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;
using RideManager.Api.Models;

namespace RideManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MechanicsController : ControllerBase
{
    private readonly AppDbContext _context;

    public MechanicsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MechanicResponseDto>>> GetMechanics()
    {
       var mechanics = await _context.Mechanics.ToListAsync();
        return mechanics.Select(m => new MechanicResponseDto
        {
            Id = m.Id,
            DocumentId = m.DocumentId,
            FullName = $"{m.FirstName} {m.LastName}",
            Phone = m.Phone,
            Email = m.Email,
            Position = m.Position
        }).ToList();
    }
    [HttpPost]
    public async Task<ActionResult<MechanicResponseDto>> CreateMechanic(MechanicRequestDto dto)
    {
        var mechanic = new Mechanic
        {
            DocumentId = dto.DocumentId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Email = dto.Email,
            Position = dto.Position
        };

        _context.Mechanics.Add(mechanic);
        await _context.SaveChangesAsync();

        return new MechanicResponseDto
        {
            Id = mechanic.Id,
            DocumentId =mechanic.DocumentId,
            FullName = $"{mechanic.FirstName} {mechanic.LastName}",
            Phone = mechanic.Phone,
            Email = mechanic.Email,
            Position = mechanic.Position
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MechanicResponseDto>> GetMechanic(int id)
    {
        var mechanic = await _context.Mechanics.FindAsync(id);
        if (mechanic == null)
            return NotFound();
        return  new MechanicResponseDto
        {
            Id = mechanic.Id,
            DocumentId=mechanic.DocumentId,
            FullName = $"{mechanic.FirstName} {mechanic.LastName}",
            Phone = mechanic.Phone,
            Email = mechanic.Email,
            Position = mechanic.Position
        };
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMechanic(int id, MechanicRequestDto dto)
    {
        var mechanic = await _context.Mechanics.FindAsync(id);
        if (mechanic == null)
            return NotFound();
        mechanic.DocumentId = dto.DocumentId;
        mechanic.FirstName = dto.FirstName;
        mechanic.LastName = dto.LastName;
        mechanic.Phone = dto.Phone;
        mechanic.Email = dto.Email;
        mechanic.Position = dto.Position;
        await _context.SaveChangesAsync();
        return NoContent();

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMechanic(int id)
    {
        var mechanic = await _context.Mechanics.FindAsync(id);
        if (mechanic == null)
            return NotFound();
        _context.Mechanics.Remove(mechanic);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}
