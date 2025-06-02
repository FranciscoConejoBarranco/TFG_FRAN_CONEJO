<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AddLibroEnListaDTO
{
    #[Assert\NotBlank(message: 'El ID del libro no puede estar vacío.')]
    #[Assert\Type(type: 'integer', message: 'El ID del libro debe ser un número entero.')]
    public int $libroId;

    #[Assert\NotBlank(message: 'El estado de lectura no puede estar vacío.')]
    #[Assert\Choice(
        choices: ['leyendo', 'leído', 'pendiente'],
        message: 'Estado no válido. Debe ser "leyendo", "leído" o "pendiente".'
    )]
    public string $estadoLectura;
}
