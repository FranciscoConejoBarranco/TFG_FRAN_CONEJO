<?php
namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class LibroRequest
{
    #[Assert\NotBlank]
    public string $titulo;

    #[Assert\NotBlank]
    public string $autor;

    #[Assert\NotBlank]
    public string $genero;

    #[Assert\NotBlank]
    public ?string $sinopsis;
    
    #[Assert\NotBlank]
    public ?string $imagen;
}
