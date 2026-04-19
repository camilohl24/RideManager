using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RideManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteMotorcycleWorkOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Motorcycles_MotorcycleId",
                table: "WorkOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Motorcycles_MotorcycleId",
                table: "WorkOrders",
                column: "MotorcycleId",
                principalTable: "Motorcycles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Motorcycles_MotorcycleId",
                table: "WorkOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Motorcycles_MotorcycleId",
                table: "WorkOrders",
                column: "MotorcycleId",
                principalTable: "Motorcycles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}