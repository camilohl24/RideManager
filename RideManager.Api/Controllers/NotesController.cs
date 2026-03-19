using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RideManager.Api.Data;
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
    public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
    {
        return await _context.Notes
            .Include(n => n.WorkOrder)
            .ToListAsync();
    }
    [HttpPost]
    public async Task<ActionResult<Note>> CreateNote(Note note)
    {
        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, note);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Note>> GetNote(int id)
    {
        var note = await _context.Notes
            .Include(n => n.WorkOrder)
            .FirstOrDefaultAsync(n => n.Id == id);
        if (note == null)
        {
            return NotFound();
        }
        return note;
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNote(int id, Note note)
    {
        if (id != note.Id)
            return BadRequest();
        _context.Entry(note).State = EntityState.Modified;
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

}




