<?php


namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class RemoveLibroEnListaDTO
{
    #[Assert\NotBlank(message: 'El ID del libro no puede estar vacío.')]
    public int $libroId;
}