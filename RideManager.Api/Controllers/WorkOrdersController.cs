using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;
using RideManager.Api.Models;

namespace RideManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkOrdersController : ControllerBase
{

    private readonly AppDbContext _context;
    public WorkOrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkOrderResponseDto>>> GetWorkOrders()
    {
        var workOrder = await GetWorkOrdersWhithIncludes().ToListAsync();
        return workOrder.Select(MapToDto).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkOrderResponseDto>> GetWorkOrder(int id)
    {
        var workOrder = await GetWorkOrdersWhithIncludes().FirstOrDefaultAsync(w => w.Id == id);

        if (workOrder == null)
            return NotFound();
        return MapToDto(workOrder);
    }

    [HttpPost]
    public async Task<ActionResult<WorkOrderResponseDto>> CreateWorkOrder(WorkOrderRequestDto dto)
    {

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
        await LoadWorKOrderRelation(workOrder);
        return MapToDto(workOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkOrder(int id, WorkOrderRequestDto dto)
    {
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkOrder(int id)
    {
        var workOrder = await _context.WorkOrders.FindAsync(id);
        if (workOrder == null)
            return NotFound();
        _context.WorkOrders.Remove(workOrder);
        await _context.SaveChangesAsync();
        return NoContent();
    }

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
        LicensePlate = w.Motorcycle.LicensePlate,
        FullNameMechanic = $"{w.Mechanic.FirstName} {w.Mechanic.LastName}"
    };

    private IQueryable<WorkOrder> GetWorkOrdersWhithIncludes() =>
        _context.WorkOrders
        .Include(w => w.Notes)
            .Include(w => w.Mechanic)
            .Include(w => w.Motorcycle)
             .ThenInclude(m => m.Owner);

    private async Task LoadWorKOrderRelation(WorkOrder workOrder)
    {
        await _context.Entry(workOrder).Reference(w => w.Motorcycle).LoadAsync();
        await _context.Entry(workOrder).Reference(w => w.Mechanic).LoadAsync();
        await _context.Entry(workOrder).Collection(w => w.Notes).LoadAsync();
    }

}




