using Microsoft.AspNetCore.Mvc;
using RideManager.Api.Models;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;

namespace RideManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotorcyclesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MotorcyclesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MotorcycleResponseDto>>> GetMotorcycles()
    {
        var motorcycle = await _context.Motorcycles
         .Include(m => m.WorkOrders)
         .Include(m => m.Owner)
         .ToListAsync();

        return motorcycle.Select(m => new MotorcycleResponseDto
        {
            Id = m.Id,
            LicensePlate = m.LicensePlate,
            Brand = m.Brand,
            Model = m.Model,
            Reference = m.Reference,
            OwnerId = m.OwnerId,
            OwnerName = $"{m.Owner.FirstName} {m.Owner.LastName}",
            WorkOrdersId = m.WorkOrders.Select(w => w.Id).ToList()
        }).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MotorcycleResponseDto>> GetMotorcycle(int id)
    {
        var motorcycle = await _context.Motorcycles
            .Include(m => m.WorkOrders)
            .Include(m => m.Owner)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (motorcycle == null)  return NotFound();

        return new MotorcycleResponseDto
        { 
            Id =motorcycle.Id,
            LicensePlate = motorcycle.LicensePlate,
            Brand = motorcycle.Brand,
            Model=motorcycle.Model,
            Reference = motorcycle.Reference,
            OwnerId = motorcycle.OwnerId,
            OwnerName = $"{motorcycle.Owner.FirstName} {motorcycle.Owner.LastName}",
            WorkOrdersId = motorcycle.WorkOrders.Select(w => w.Id).ToList()
        };
    }

    [HttpPost]
    public async Task<ActionResult<MotorcycleResponseDto>> CreateMotorcycle(MotorcycleRequestDto dto)
    {
        var motorcycle = new Motorcycle()
        {
            LicensePlate = dto.LicensePlate,
            Brand = dto.Brand,
            Model = dto.Model,
            Reference = dto.Reference,
            OwnerId = dto.OwnerId
        };

        _context.Motorcycles.Add(motorcycle);
        await _context.SaveChangesAsync();

        await _context.Entry(motorcycle).Reference(m => m.Owner).LoadAsync();
        return new MotorcycleResponseDto
        {
            Id = motorcycle.Id,
            LicensePlate= motorcycle.LicensePlate,
            Brand = motorcycle.Brand,
            Model = motorcycle.Model,
            Reference = motorcycle.Reference,
            OwnerId= motorcycle.OwnerId,
            OwnerName = $"{motorcycle.Owner.FirstName} {motorcycle.Owner.LastName}",
            WorkOrdersId = motorcycle.WorkOrders.Select(w => w.Id).ToList()
        };
    }
    

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMotorcycle(int id, MotorcycleRequestDto dto)
    {
        var motorcycle = await _context.Motorcycles.FindAsync(id);
        if (motorcycle == null) return NotFound();
        motorcycle.LicensePlate = dto.LicensePlate;
        motorcycle.Brand = dto.Brand;
        motorcycle.Model = dto.Model;
        motorcycle.Reference = dto.Reference;
        motorcycle.OwnerId = dto.OwnerId;

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
