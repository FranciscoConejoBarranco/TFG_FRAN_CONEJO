<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class LoginDto
{

    public function __construct(
        #[Assert\NotBlank(message:'El campo email está vacio')]
        #[Assert\Email(message:'El Email ingresado no es válido')]
        public readonly string $email,

        #[Assert\NotBlank(message:'El campo password está vacio')]
        public readonly string $password
    )
    {
    }
}
