using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators;

public class NoteRequestValidator : AbstractValidator<NoteRequestDto>
{
    public NoteRequestValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Este campo descripcion no puede estar vacio")
            .MaximumLength(500).WithMessage("La novedad que estas ingresando no puede superar los 500 caracteres");

        RuleFor(x => x.WorkOrderId)
            .GreaterThan(0).WithMessage("Debe de especificar un id valido");
    }
}