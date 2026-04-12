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

        return owners.Select(MapToDto).ToList();

    }
    [HttpPost]
    public async Task<ActionResult<OwnerResponseDto>> CreateOwner(OwnerRequestDto dto)
    {

        var owner = new Owner
        {
            DocumentId = dto.DocumentId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Email = dto.Email
        };
        _context.Owners.Add(owner);
        await _context.SaveChangesAsync();

        var result = await _context.Owners
            .Include(O => O.Motorcycles)
            .FirstOrDefaultAsync(o => o.Id == owner.Id);
      return  MapToDto(result!);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OwnerResponseDto>> GetOwner(int id)
    {
        var owner = await _context.Owners
            .Include(o => o.Motorcycles)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (owner == null)
            return NotFound();
        return MapToDto(owner);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOwner (int id, OwnerRequestDto dto)
    {
        var owner = await _context.Owners.FindAsync(id);
        if (owner == null)
            return NotFound();
        owner.DocumentId = dto.DocumentId;
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

    private OwnerResponseDto MapToDto(Owner o) => new OwnerResponseDto
    {
        Id = o.Id,
        DocumentId = o.DocumentId,
        FullName = $"{o.FirstName} {o.LastName}",
        Phone = o.Phone,
        Email = o.Email,
        CreatedAt = o.CreatedAt,
        Motorcycles = o.Motorcycles.Select(m => new OwnerMotorcycleDTO
        {
            LicensePlate = m.LicensePlate,
            Brand = m.Brand,
            Model = m.Model,
            Reference = m.Reference,
        }).ToList()
    };
}
