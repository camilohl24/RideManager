using Microsoft.AspNetCore.Mvc;
using RideManager.Api.Models;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;

namespace RideManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotorcyclesController: ControllerBase
{
    private readonly AppDbContext _context;

    public MotorcyclesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Motorcycle>>> GetMotorcycles()
    {
        return await _context.Motorcycles
            .Include(m => m.WorkOrders)
            .Include(m => m.Owner)
            .ToListAsync();
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Motorcycle>> GetMotorcycle(int id)
    {
        var motorcycle = await _context.Motorcycles
            .Include(m => m.WorkOrders)
            .Include(m => m.Owner)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (motorcycle == null)
            return NotFound();

        return motorcycle;
    }

    [HttpPost]
    public async Task<ActionResult<Motorcycle>> CreateMotorcycle(Motorcycle motorcycle)
    {
        _context.Motorcycles.Add(motorcycle);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMotorcycles), new { id = motorcycle.Id }, motorcycle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMotorcycle(int id, Motorcycle motorcycle)
    {
        if (id != motorcycle.Id)
            return BadRequest();
        _context.Entry(motorcycle).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMotorcycle(int id)
    {
        var motorcycle = await _context.Motorcycles.FindAsync(id);
        if (motorcycle == null)
            return NotFound();
        _context.Motorcycles.Remove(motorcycle);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}
