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
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EntityValidator _entityValidator;

    public AppointmentsController(AppDbContext context, EntityValidator entityValidator)
    {
        _context = context;
        _entityValidator = entityValidator;
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentResponseDto>> CreateAppointment(AppointmentRequestDto dto)
    {
        var error = await ValidateAppointmentFks(dto);
        if (error != null) return BadRequest(error);

        var lastTurn = await _context.Appointments
            .Where(a => a.MechanicId == dto.MechanicId)
            .Where(a => a.CreatedAt.Date == DateTime.Today)
            .MaxAsync(a => (int?)a.TurnNumber) ?? 0;
        var newTurn = lastTurn + 1;

        var appointmet = new Appointment
        {
            ContactName = dto.ContactName,
            ContactPhone = dto.ContactPhone,
            MechanicId = dto.MechanicId,
            MotorcycleId = dto.MotorcycleId,
            OwnerId = dto.OwnerId,
            Reason = dto.Reason,
            Status = AppointmentStatus.Pending,
            TurnNumber = newTurn,
            CreatedAt = DateTime.Now,
            Type = dto.Type
        };
        _context.Appointments.Add(appointmet);
        await _context.SaveChangesAsync();

        var result = await _context.Appointments
            .Include(a => a.Mechanic)
            .Include(a => a.Owner)
            .Include(a => a.Motorcycle)
            .FirstOrDefaultAsync(a => a.Id == appointmet.Id);
        return MapToDto(result!);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();
        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentResponseDto>> GetAppointment(int id)
    {
        var appointment = await GetAppointmentsWhithIncludes().FirstOrDefaultAsync(a => a.Id == id);
        if (appointment == null)
            return NotFound();
        return MapToDto(appointment);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAppointments()
    {
        var appointment = await GetAppointmentsWhithIncludes().ToListAsync();
        return appointment.Select(MapToDto).ToList();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, AppointmentRequestDto dto)
    {
        var error = await ValidateAppointmentFks(dto);
        if (error != null) return BadRequest(error);

        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        appointment.ContactName = dto.ContactName;
        appointment.ContactPhone = dto.ContactPhone;
        appointment.MechanicId = dto.MechanicId;
        appointment.MotorcycleId = dto.MotorcycleId;
        appointment.OwnerId = dto.OwnerId;
        appointment.Reason = dto.Reason;
        appointment.Status = AppointmentStatus.Pending;
        appointment.Type = dto.Type;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private IQueryable<Appointment> GetAppointmentsWhithIncludes() =>
        _context.Appointments
        .Include(a => a.Mechanic)
        .Include(a => a.Owner)
        .Include(a => a.Motorcycle);

    private AppointmentResponseDto MapToDto(Appointment a) => new AppointmentResponseDto
    {
        Id = a.Id,
        ContactName = a.ContactName,
        ContactPhone = a.ContactPhone,
        CreatedAt = a.CreatedAt,
        FullNameMechanic = a.Mechanic != null ? $"{a.Mechanic.FirstName} {a.Mechanic.LastName}" : null,
        LicensePlate = a.Motorcycle?.LicensePlate,
        FullNameOwner = a.Owner != null ? $"{a.Owner.FirstName} {a.Owner.LastName}" : null,
        Reason = a.Reason,
        ScheduledAt = a.ScheduledAt,
        Status = a.Status,
        TurnNumber = a.TurnNumber
    };

    private async Task<string?> ValidateAppointmentFks(AppointmentRequestDto dto)
    {
        if (!await _entityValidator.MechanicExists(dto.MechanicId))
            return "El mecanico especificado no existe";
        if (dto.OwnerId.HasValue && !await _entityValidator.OwnerExists(dto.OwnerId))
            return "El dueño de la moto especificado no existe";
        if (dto.MotorcycleId.HasValue && !await _entityValidator.MotorcycleExists(dto.MotorcycleId))
            return "La moto especificada no existe";
        return null;
    }
}