using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RideManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteMotorcycleAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Motorcycles_MotorcycleId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Motorcycles_MotorcycleId",
                table: "Appointments",
                column: "MotorcycleId",
                principalTable: "Motorcycles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Motorcycles_MotorcycleId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Motorcycles_MotorcycleId",
                table: "Appointments",
                column: "MotorcycleId",
                principalTable: "Motorcycles",
                principalColumn: "Id");
        }
    }
}
