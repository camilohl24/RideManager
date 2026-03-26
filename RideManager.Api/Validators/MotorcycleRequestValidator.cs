using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators;

public class MotorcycleRequestValidator : AbstractValidator<MotorcycleRequestDto>
{
    public MotorcycleRequestValidator()
    {
        RuleFor(x => x.LicensePlate)
            .NotEmpty().WithMessage("La placa de la moto es obligatoria")
            .MaximumLength(7).WithMessage("La placa no puede contener mas de 7 caracteres")
            .MinimumLength(5).WithMessage("La placa no puede contener menos de 5 caracteres");

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("La marca de la moto es obligatoria");
        RuleFor(x => x.Model)
            .GreaterThan(1950).WithMessage("El modelo de la moto no es valido")
            .LessThanOrEqualTo(DateTime.Now.Year + 1).WithMessage("Modelo no valido");
        RuleFor(x => x.Reference)
            .NotEmpty().WithMessage("Debe de especificar la referencia de la moto ");
        RuleFor(x => x.OwnerId)
            .GreaterThan(0).WithMessage("Debe de especificar un dueño valido");
    }
}