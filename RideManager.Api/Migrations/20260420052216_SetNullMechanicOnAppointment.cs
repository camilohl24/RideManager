using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RideManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class SetNullMechanicOnAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Mechanics_MechanicId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Mechanics_MechanicId",
                table: "Appointments",
                column: "MechanicId",
                principalTable: "Mechanics",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Mechanics_MechanicId",
                table: "Appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Mechanics_MechanicId",
                table: "Appointments",
                column: "MechanicId",
                principalTable: "Mechanics",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
