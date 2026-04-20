using Microsoft.EntityFrameworkCore;
using RideManager.Api.Models;

namespace RideManager.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Mechanic> Mechanics { get; set; }
    public DbSet<Motorcycle> Motorcycles { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Owner> Owners { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<WorkOrder> WorkOrders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Motorcycle>()
           .HasMany(m => m.WorkOrders)
           .WithOne(w => w.Motorcycle)
           .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkOrder>()
          .HasMany(w => w.Notes)
          .WithOne(n => n.WorkOrder)
          .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Motorcycle)
            .WithMany()
            .HasForeignKey(a => a.MotorcycleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkOrder>()
           .HasOne(w => w.Mechanic)
           .WithMany()
           .HasForeignKey(w => w.MechanicId)
           .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Appointment>()
          .HasOne(a => a.Mechanic)
          .WithMany()
          .HasForeignKey(a => a.MechanicId)
          .OnDelete(DeleteBehavior.SetNull);

    }
}