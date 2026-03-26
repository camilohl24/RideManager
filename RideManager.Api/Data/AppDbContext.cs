using Microsoft.EntityFrameworkCore;
using RideManager.Api.Models;

namespace RideManager.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Owner> Owners { get; set; }
    public DbSet<Motorcycle> Motorcycles { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<WorkOrder> WorkOrders { get; set; } 
    public DbSet<Mechanic> Mechanics { get; set; } 
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();
    }
}
