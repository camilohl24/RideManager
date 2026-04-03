using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;

namespace RideManager.Api.Services;

public class EntityValidator
{
    private readonly AppDbContext _context;

    public EntityValidator(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> MechanicExists(int? id) =>
        await _context.Mechanics.AnyAsync(m => m.Id == id);

    public async Task<bool> MotorcycleExists(int? id) =>
        await _context.Motorcycles.AnyAsync(m => m.Id == id);

    public async Task<bool> OwnerExists(int? id) =>
            await _context.Owners.AnyAsync(o => o.Id == id);

    public async Task<bool> WorkOrderExists(int id) =>
        await _context.WorkOrders.AnyAsync(w => w.Id == id);
}