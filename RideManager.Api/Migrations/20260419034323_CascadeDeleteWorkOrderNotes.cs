using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RideManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteWorkOrderNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                 name: "FK_Notes_WorkOrders_WorkOrderId",
                 table: "Notes");
            migrationBuilder.AddForeignKey(
                name: "FK_Notes_WorkOrders_WorkOrderId",
                table: "Notes",
                column: "WorkOrderId",
                principalTable: "WorkOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
               name: "FK_Notes_WorkOrders_WorkOrderId",
               table: "Notes");
            migrationBuilder.AddForeignKey(
                name: "FK_Notes_WorkOrders_WorkOrderId",
                table: "Notes",
                column: "WorkOrderId",
                principalTable: "WorkOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);


        }
    }
}
