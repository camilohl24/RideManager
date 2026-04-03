using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators;

public class AppointmentRequestValidator : AbstractValidator<AppointmentRequestDto>
{
    public AppointmentRequestValidator()
    {
        RuleFor(x => x.ContactName)
            .NotEmpty().WithMessage("Debe especificar un nombre")
            .When(x => !x.OwnerId.HasValue);
        RuleFor(x => x.ContactPhone)
            .NotEmpty().WithMessage("Este campo no puede estar vacio")
            .MinimumLength(7).WithMessage("Debe especificar un numero de telefono valido minimo 7 caracteres")
            .MaximumLength(10).WithMessage("Debe especificar un numero de telefono valido maximo 10 caracteres")
            .When(x => !x.OwnerId.HasValue);
        RuleFor(x => x.MechanicId)
            .GreaterThan(0).WithMessage("Debe de especificar un mecanico valido");
        RuleFor(x => x.OwnerId)
            .GreaterThan(0).WithMessage("Debe de especificar un dueño valido")
            .When(x => x.OwnerId.HasValue);
        RuleFor(x => x.MotorcycleId)
            .GreaterThan(0).WithMessage("Debe de especificar una moto valida valido")
            .When(x => x.MotorcycleId.HasValue);
        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("El motivo es obligatorio")
            .MaximumLength(500).WithMessage("El motivo no puede superar 500 caracteres");
        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Debe especificar un tipo de ingreso");
    }
}