using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
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
    public async Task<ActionResult<IEnumerable<WorkOrder>>> GetWorkOrders()
    {
        return await _context.WorkOrders
            .Include(w => w.Notes)
            .Include(w => w.Mechanic)
            .Include(w => w.Motorcycle)
                .ThenInclude(m => m.Owner)
           .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkOrder>> GetWorkOrder(int id)
    {
        var workOrder = await _context.WorkOrders
            .Include(w => w.Notes)
            .Include(w => w.Mechanic)
            .Include(w => w.Motorcycle)
             .ThenInclude(m => m.Owner)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workOrder == null)
            return NotFound();

        return workOrder;
    }

    [HttpPost]
    public async Task<ActionResult<WorkOrder>> CreateWorkOrder(WorkOrder workOrder)
    {
        _context.WorkOrders.Add(workOrder);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorkOrders), new { id = workOrder.Id }, workOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkOrder(int id, WorkOrder workOrder)
    {
        if (id != workOrder.Id)
            return BadRequest();
        _context.Entry(workOrder).State = EntityState.Modified;
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


}




