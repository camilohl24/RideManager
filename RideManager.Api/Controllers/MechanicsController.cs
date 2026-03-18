using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.Models;

namespace RideManager.Api.Controllers;

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
    public async Task<ActionResult<IEnumerable<Mechanic>>> GetMechanics()
    {
        return await _context.Mechanics.ToListAsync();
    }
    [HttpPost]
    public async Task<ActionResult<Mechanic>> CreateMechanic(Mechanic mechanic)
    {
        _context.Mechanics.Add(mechanic);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMechanics), new { id = mechanic.Id }, mechanic);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Mechanic>> GetMechanic(int id)
    {
        var mechanic = await _context.Mechanics.FindAsync(id);
        if (mechanic == null)
        {
            return NotFound();
        }
        return mechanic;
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMechanic(int id, Mechanic mechanic)
    {
        if (id != mechanic.Id)
            return BadRequest();
        _context.Entry(mechanic).State = EntityState.Modified;
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
