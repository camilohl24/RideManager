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
public class WorkOrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EntityValidator _entityValidator;

    public WorkOrdersController(AppDbContext context, EntityValidator entityValidator)
    {
        _context = context;
        _entityValidator = entityValidator;
    }

    [HttpPost]
    public async Task<ActionResult<WorkOrderResponseDto>> CreateWorkOrder(WorkOrderRequestDto dto)
    {
        var error = await ValidateWorkOrdersFKs(dto);
        if (error != null) return BadRequest(error);
        var workOrder = new WorkOrder()
        {
            Description = dto.Description,
            Diagnosis = dto.Diagnosis,
            Status = dto.Status,
            Cost = dto.Cost,
            MotorcycleId = dto.MotorcycleId,
            MechanicId = dto.MechanicId,
        };
        _context.WorkOrders.Add(workOrder);
        await _context.SaveChangesAsync();

        var result = await GetWorkOrdersWhithIncludes().FirstOrDefaultAsync(w => w.Id == workOrder.Id);
        return MapToDto(result!);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkOrder(int id)
    {
        var workOrder = await _context.WorkOrders.FindAsync(id);
        if (workOrder == null) return NotFound();
        _context.WorkOrders.Remove(workOrder);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkOrderResponseDto>> GetWorkOrder(int id)
    {
        var workOrder = await GetWorkOrdersWhithIncludes().FirstOrDefaultAsync(w => w.Id == id);

        if (workOrder == null)
            return NotFound();
        return MapToDto(workOrder);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkOrderResponseDto>>> GetWorkOrders()
    {
        var workOrder = await GetWorkOrdersWhithIncludes().ToListAsync();
        return workOrder.Select(MapToDto).ToList();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkOrder(int id, WorkOrderRequestDto dto)
    {
        var error = await ValidateWorkOrdersFKs(dto);
        if (error != null) return BadRequest(error);

        var workOrder = await _context.WorkOrders.FindAsync(id);
        if (workOrder == null) return NotFound();
        workOrder.Description = dto.Description;
        workOrder.Diagnosis = dto.Diagnosis;
        workOrder.Status = dto.Status;
        workOrder.Cost = dto.Cost;
        workOrder.MotorcycleId = dto.MotorcycleId;
        workOrder.MechanicId = dto.MechanicId;
        if (dto.Status is WorkOrderStatus.Done or WorkOrderStatus.ReadyForDelivery)
            workOrder.CompletedAt = DateTime.Now;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private IQueryable<WorkOrder> GetWorkOrdersWhithIncludes() =>
        _context.WorkOrders
        .Include(w => w.Notes)
            .Include(w => w.Mechanic)
            .Include(w => w.Motorcycle)
             .ThenInclude(m => m.Owner);

    private WorkOrderResponseDto MapToDto(WorkOrder w) => new WorkOrderResponseDto
    {
        Id = w.Id,
        Description = w.Description,
        Diagnosis = w.Diagnosis,
        Status = w.Status,
        CreatedAt = w.CreatedAt,
        CompletedAt = w.CompletedAt,
        Cost = w.Cost,
        NotesId = w.Notes.Select(n => n.Id).ToList(),
        LicensePlate = w.Motorcycle != null ? w.Motorcycle.LicensePlate : null!,
        FullNameMechanic = w.Mechanic != null ? $"{w.Mechanic.FirstName} {w.Mechanic.LastName}" : null!,
        OwnerName = w.Motorcycle?.Owner != null ? $"{w.Motorcycle.Owner.FirstName} {w.Motorcycle.Owner.LastName}" : null!
    };

    private async Task<string?> ValidateWorkOrdersFKs(WorkOrderRequestDto dto)
    {
        if (!await _entityValidator.MechanicExists(dto.MechanicId))
            return "El mecancico especificado no existe";
        if (!await _entityValidator.MotorcycleExists(dto.MotorcycleId))
            return "La moto especificada no existe";
        return null;
    }
}