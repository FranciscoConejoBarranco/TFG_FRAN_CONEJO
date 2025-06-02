<?php

namespace App\Entity;

use App\Repository\LibroEnListaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LibroEnListaRepository::class)]
class LibroEnLista
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    private ?string $estadolectura = null;

    #[ORM\ManyToOne(inversedBy: 'libroEnListas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ListaLectura $listaLectura = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Libro $libro = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEstadolectura(): ?string
    {
        return $this->estadolectura;
    }

    public function setEstadolectura(string $estadolectura): static
    {
        $this->estadolectura = $estadolectura;

        return $this;
    }

    public function getListaLectura(): ?ListaLectura
    {
        return $this->listaLectura;
    }

    public function setListaLectura(?ListaLectura $listaLectura): static
    {
        $this->listaLectura = $listaLectura;

        return $this;
    }

    public function getLibro(): ?Libro
    {
        return $this->libro;
    }

    public function setLibro(?Libro $libro): static
    {
        $this->libro = $libro;

        return $this;
    }
}
