<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CrearReviewDTO
{
    #[Assert\NotBlank(message: "El contenido no puede estar vacío.")]
    #[Assert\Length(min: 5, minMessage: "El contenido debe tener al menos {{ limit }} caracteres.")]
    public string $contenido;

    #[Assert\NotBlank(message: "El ID del libro es obligatorio.")]
    #[Assert\Type(type: "integer", message: "El ID del libro debe ser un número entero.")]
    public int $libroId;

    #[Assert\NotNull(message: "La puntuación es obligatoria.")]
    #[Assert\Range(
        min: 1,
        max: 5,
        notInRangeMessage: "La puntuación debe estar entre {{ min }} y {{ max }}."
    )]
    public ?int $rating = null;
}
