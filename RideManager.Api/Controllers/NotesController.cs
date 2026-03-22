using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
using RideManager.Api.DTOs;
using RideManager.Api.Models;

namespace RideManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class NotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotesController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteResponseDto>>> GetNotes()
    {
        var note =  await _context.Notes
            .Include(n => n.WorkOrder)
            .ToListAsync();
        return  note.Select(MapToDto).ToList();
    }
    [HttpPost]
    public async Task<ActionResult<NoteResponseDto>> CreateNote(NoteRequestDto dto)
    {
        var note = new Note()
        {
            Description = dto.Description,
            WorkOrderId = dto.WorkOrderId,
        };

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        await _context.Entry(note).Reference(n => n.WorkOrder).LoadAsync();
        return MapToDto(note);
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


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNote(int id, NoteRequestDto dto)
    {
        var note = await _context.Notes.FindAsync(id);
        if(note == null) return NotFound();
        note.WorkOrderId = dto.WorkOrderId;
        note.Description = dto.Description;
        await _context.SaveChangesAsync();
        return NoContent();
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
    private NoteResponseDto MapToDto(Note n) => new NoteResponseDto
    {
        Id = n.Id,
        Description = n.Description,
        CreatedAt = n.CreatedAt,
        WorkOrderId = n.WorkOrderId
    };
}




