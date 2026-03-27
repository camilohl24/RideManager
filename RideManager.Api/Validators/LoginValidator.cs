using FluentValidation;
using RideManager.Api.DTOs;

namespace RideManager.Api.Validators;

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Debe especificar un usuario");
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Debe de especificar una contraseña");
    }
}