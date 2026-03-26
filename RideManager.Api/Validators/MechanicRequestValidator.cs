using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators
{
    public class MechanicRequestValidator : AbstractValidator<MechanicRequestDto>
    {
        public MechanicRequestValidator()
        {
            RuleFor(x => x.DocumentId)
                .NotEmpty().WithMessage("Este campo Id no puede estar vacio")
                .MinimumLength(8).WithMessage("Debe especificar un documento de identidad valido minimo 8 caracteres")
                .MaximumLength(10).WithMessage("Debe especificar un documento de identidad valido maximo 10 caracteres");
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Debe especificar un nombre");
            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Debe especificar apellidos");
            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Este campo no puede estar vacio")
                .MinimumLength(7).WithMessage("Debe especificar un numero de telefono valido minimo 7 caracteres")
                .MaximumLength(10).WithMessage("Debe especificar un numero de telefono valido maximo 10 caracteres");
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Este campo Email no puede estar vacio")
                .EmailAddress().WithMessage("El email no tiene un formato valido");
            RuleFor(x => x.Position)
                .NotEmpty().WithMessage("Debe de especificar un puesto valido");
        }
    }
}