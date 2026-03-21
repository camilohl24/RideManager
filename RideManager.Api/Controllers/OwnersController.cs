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
    public async Task<ActionResult<Owner>> CreateOwner(Owner owner)
    {
        _context.Owners.Add(owner);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOwners), new { id = owner.Id }, owner);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Owner>> GetOwner(int id)
    {
        var owner = await _context.Owners
            .Include(o => o.Motorcycles)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (owner == null)
            return NotFound();
        return owner;
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOwner (int id, Owner owner)
    {
        if(id != owner.Id)
           return BadRequest();
        _context.Entry(owner).State = EntityState.Modified;
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
