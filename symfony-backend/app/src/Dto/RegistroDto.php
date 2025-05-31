<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class RegistroDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'El campo nombre está vacio')]
        #[Assert\Type('string')]
        public readonly string $name,

        #[Assert\NotBlank(message: 'El campo E-mail está vacio')]
        #[Assert\Email(message: 'El E-mail no tiene un formato válido')]
        public readonly string $email,

        #[Assert\NotBlank(message: 'El campo password está vacio')]
        public readonly string $password,

        #[Assert\All([
            new Assert\Choice(
                choices: ['ROLE_USER', 'ROLE_GESTOR', 'ROLE_SUPERADMIN'],
                message: 'El rol "{{ value }}" no es válido. Opciones válidas: ROLE_USER, ROLE_GESTOR, ROLE_SUPERADMIN.'
            )
        ])]
        public readonly ?array $roles = null
    ) {
    }
}
