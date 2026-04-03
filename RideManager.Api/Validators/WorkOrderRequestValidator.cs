using RideManager.Api.DTOs;
using FluentValidation;

namespace RideManager.Api.Validators;

public class WorkOrderRequestValidator : AbstractValidator<WorkOrderRequestDto>
{
    public WorkOrderRequestValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La descripcion es obligatoria.")
            .MaximumLength(500).WithMessage("La descripcion no puede superar 500 caracteres");
        RuleFor(x => x.Diagnosis)
            .NotEmpty().WithMessage("El diagnositco es obligatorio")
            .MaximumLength(500).WithMessage("El diagnostico no puede superar 500 caracteres");
        RuleFor(x => x.Cost)
            .GreaterThanOrEqualTo(0).WithMessage("El Valor del servicio no puede ser negativo");
        RuleFor(x => x.MotorcycleId)
            .GreaterThan(0).WithMessage("Debe especificar una moto valida");
        RuleFor(x => x.MechanicId)
            .GreaterThan(0).WithMessage("Debe de especificar un mecanico valido");
    }
}