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

public class NotesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EntityValidator _entityValidator;

    public NotesController(AppDbContext context, EntityValidator entityValidator)
    {
        _context = context;
        _entityValidator = entityValidator;
    }

    [HttpPost]
    public async Task<ActionResult<NoteResponseDto>> CreateNote(NoteRequestDto dto)
    {
        if (!await _entityValidator.WorkOrderExists(dto.WorkOrderId))
            return BadRequest("La orden de trabajo especificada no existe");
        var note = new Note()
        {
            Description = dto.Description,
            WorkOrderId = dto.WorkOrderId,
        };

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        var result = await _context.Notes
            .Include(n => n.WorkOrder)
            .FirstOrDefaultAsync(n => n.Id == note.Id);
        return MapToDto(result!);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
            return NotFound();
        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NoteResponseDto>> GetNote(int id)
    {
        var note = await _context.Notes
            .Include(n => n.WorkOrder)
            .FirstOrDefaultAsync(n => n.Id == id);
        if (note == null) return NotFound();

        return MapToDto(note);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteResponseDto>>> GetNotes()
    {
        var note = await _context.Notes
            .Include(n => n.WorkOrder)
            .ToListAsync();
        return note.Select(MapToDto).ToList();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNote(int id, NoteRequestDto dto)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null) return NotFound();

        if (!await _entityValidator.WorkOrderExists(dto.WorkOrderId))
            return BadRequest("La orden de trabajo especificada no existe");

        note.WorkOrderId = dto.WorkOrderId;
        note.Description = dto.Description;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private NoteResponseDto MapToDto(Note n) => new NoteResponseDto
    {
        Id = n.Id,
        Description = n.Description,
        CreatedAt = n.CreatedAt,
        WorkOrderId = n.WorkOrderId
    };
}