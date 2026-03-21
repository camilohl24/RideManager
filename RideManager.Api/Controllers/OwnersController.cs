using Microsoft.AspNetCore.Mvc;
using RideManager.Api.Models;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;

namespace RideManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OwnersController : ControllerBase
{

    private readonly AppDbContext _context;

    public OwnersController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OwnerResponseDto>>> GetOwners()
    {
        var owners = await _context.Owners
        .Include(o => o.Motorcycles)
        .ToListAsync();

        return owners.Select(o => new OwnerResponseDto
        {
            Id = o.Id,
            FullName = $"{o.FirstName} {o.LastName}",
            Phone = o.Phone,
            Email = o.Email,
            LicensePlates = o.Motorcycles.Select(m => m.LicensePlate).ToList()
        }).ToList();

    }
    [HttpPost]
    public async Task<ActionResult<OwnerResponseDto>> CreateOwner(OwnerRequestDto dto)
    {

        var owner = new Owner
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Email = dto.Email
        };
        _context.Owners.Add(owner);
        await _context.SaveChangesAsync();
        return new OwnerResponseDto
        {
            Id = owner.Id,
            FullName = $"{owner.FirstName} {owner.LastName}",
            Phone = owner.Phone,
            Email = owner.Email,
            LicensePlates = []
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OwnerResponseDto>> GetOwner(int id)
    {
        var owner = await _context.Owners
            .Include(o => o.Motorcycles)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (owner == null)
            return NotFound();
        return new OwnerResponseDto 
        { Id = owner.Id, 
            FullName = $"{owner.FirstName} {owner.LastName}", 
            Phone = owner.Phone, 
            Email = owner.Email,
            LicensePlates = [.. owner.Motorcycles.Select(m => m.LicensePlate)] 
        };
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOwner (int id, OwnerRequestDto dto)
    {
        var owner = await _context.Owners.FindAsync(id);
        if (owner == null)
            return NotFound();
        owner.FirstName = dto.FirstName;
        owner.LastName = dto.LastName;
        owner.Email = dto.Email;
        owner.Phone = dto.Phone;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOwner(int id)
    {
        var owner = await _context.Owners.FindAsync(id);
        if (owner == null)
            return NotFound();
        _context.Owners.Remove(owner);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
