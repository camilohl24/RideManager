using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Debe especificar un usuario")
            .MinimumLength(4).WithMessage("Minimo 4 caracteres para el registro del usuario")
            .MaximumLength(20).WithMessage("Maximo 20 caracteres para el registro del usuario");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Debe especificar una contraseña")
            .MinimumLength(8).WithMessage("La contraseña debe de contener mas de 8 caracteres");
        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Debe especificar el cargo del usuario nuevo");
    }
}