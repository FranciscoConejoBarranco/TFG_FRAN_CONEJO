<?php
namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CrearListaLecturaDTO
{
    #[Assert\NotBlank(message: 'El nombre de la lista no puede estar vacío.')]
    public string $nombre;
}
