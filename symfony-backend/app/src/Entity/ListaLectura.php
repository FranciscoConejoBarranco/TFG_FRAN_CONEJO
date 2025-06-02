<?php

namespace App\Entity;

use App\Repository\ListaLecturaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaLecturaRepository::class)]
class ListaLectura
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $fechaCreacion = null;

    #[ORM\ManyToOne(inversedBy: 'listasLectura')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $usuario = null;

    /**
     * @var Collection<int, LibroEnLista>
     */
    #[ORM\OneToMany(targetEntity: LibroEnLista::class, mappedBy: 'listaLectura', orphanRemoval: true)]
    private Collection $libroEnListas;

    public function __construct()
    {
        $this->libroEnListas = new ArrayCollection();
        $this->fechaCreacion = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getFechaCreacion(): ?\DateTimeImmutable
    {
        return $this->fechaCreacion;
    }

    public function setFechaCreacion(\DateTimeImmutable $fechaCreacion): static
    {
        $this->fechaCreacion = $fechaCreacion;

        return $this;
    }

    public function getUsuario(): ?User
    {
        return $this->usuario;
    }

    public function setUsuario(?User $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    /**
     * @return Collection<int, LibroEnLista>
     */
    public function getLibroEnListas(): Collection
    {
        return $this->libroEnListas;
    }

    public function addLibroEnLista(LibroEnLista $libroEnLista): static
    {
        if (!$this->libroEnListas->contains($libroEnLista)) {
            $this->libroEnListas->add($libroEnLista);
            $libroEnLista->setListaLectura($this);
        }

        return $this;
    }

    public function removeLibroEnLista(LibroEnLista $libroEnLista): static
    {
        if ($this->libroEnListas->removeElement($libroEnLista)) {
            // set the owning side to null (unless already changed)
            if ($libroEnLista->getListaLectura() === $this) {
                $libroEnLista->setListaLectura(null);
            }
        }

        return $this;
    }
}
