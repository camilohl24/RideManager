using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;
using RideManager.Api.Models;
using RideManager.Api.Services;

namespace RideManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MotorcyclesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EntityValidator _entityValidator;

    public MotorcyclesController(AppDbContext context, EntityValidator entityValidator)
    {
        _context = context;
        _entityValidator = entityValidator;
    }

    [HttpPost]
    public async Task<ActionResult<MotorcycleResponseDto>> CreateMotorcycle(MotorcycleRequestDto dto)
    {
        if (!await _entityValidator.OwnerExists(dto.OwnerId))
            return BadRequest("El dueño de la moto especificado no existe");
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

        var result = await _context.Motorcycles
            .Include(m => m.Owner)
            .Include(m => m.WorkOrders)
            .FirstOrDefaultAsync(m => m.Id == motorcycle.Id);
        return MapToDto(result!);
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

    [HttpGet("{id}")]
    public async Task<ActionResult<MotorcycleResponseDto>> GetMotorcycle(int id)
    {
        var motorcycle = await _context.Motorcycles
            .Include(m => m.WorkOrders)
            .Include(m => m.Owner)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (motorcycle == null) return NotFound();

        return MapToDto(motorcycle);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MotorcycleResponseDto>>> GetMotorcycles()
    {
        var motorcycle = await _context.Motorcycles
         .Include(m => m.WorkOrders)
         .Include(m => m.Owner)
         .ToListAsync();

        return motorcycle.Select(MapToDto).ToList();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMotorcycle(int id, MotorcycleRequestDto dto)
    {
        if (!await _entityValidator.OwnerExists(dto.OwnerId))
            return BadRequest("El dueño de la moto especificado no existe");

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

    private MotorcycleResponseDto MapToDto(Motorcycle m) => new MotorcycleResponseDto
    {
        Id = m.Id,
        LicensePlate = m.LicensePlate,
        Brand = m.Brand,
        Model = m.Model,
        Reference = m.Reference,
        OwnerId = m.OwnerId,
        OwnerName = m.Owner != null ? $"{m.Owner.FirstName} {m.Owner.LastName}" : null!,
        WorkOrdersId = m.WorkOrders.Select(w => w.Id).ToList(),
        CreatedAt = m.CreatedAt
    };
}