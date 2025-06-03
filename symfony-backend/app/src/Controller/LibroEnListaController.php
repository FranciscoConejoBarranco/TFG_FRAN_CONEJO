<?php

namespace App\Controller;

use App\Dto\AddLibroEnListaDTO;
use App\Entity\LibroEnLista;
use App\Repository\LibroRepository;
use App\Repository\ListaLecturaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Dto\RemoveLibroEnListaDTO;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

class LibroEnListaController extends AbstractController
{
    #[Route('api/lista-lectura/{id}/add-libro', name: 'add_libro_to_lista', methods: ['POST'])]
    public function addLibroToLista(
        int $id,
        #[MapRequestPayload(validationGroups: ['Default'])] AddLibroEnListaDTO $dto,
        ListaLecturaRepository $listaLecturaRepository,
        LibroRepository $libroRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $lista = $listaLecturaRepository->find($id);
        if (!$lista) {
            return $this->json(['error' => 'Lista de lectura no encontrada.'], 404);
        }

        $libro = $libroRepository->find($dto->libroId);
        if (!$libro) {
            return $this->json(['error' => 'Libro no encontrado.'], 404);
        }

        $existe = $em->getRepository(LibroEnLista::class)->findOneBy([
            'listaLectura' => $lista,
            'libro' => $libro,
        ]);

        if ($existe) {
            return $this->json(['error' => 'Este libro ya está en la lista.'], 409);
        }

        // ✅ Crear nueva relación libro-en-lista
        $libroEnLista = new LibroEnLista();
        $libroEnLista->setListaLectura($lista);
        $libroEnLista->setLibro($libro);
        $libroEnLista->setEstadolectura($dto->estadoLectura);

        $em->persist($libroEnLista);
        $em->flush();

        return $this->json([
            'message' => 'Libro añadido a la lista correctamente.',
            'data' => [
                'listaId' => $lista->getId(),
                'libroId' => $libro->getId(),
                'estadoLectura' => $dto->estadoLectura
            ]
        ], 201);
    }


    #[Route('api/lista-lectura/{id}/remove-libro', name: 'remove_libro_from_lista', methods: ['DELETE'])]
    public function removeLibroFromLista(
        int $id,
        #[MapRequestPayload] RemoveLibroEnListaDTO $dto,
        ListaLecturaRepository $listaLecturaRepository,
        LibroRepository $libroRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $lista = $listaLecturaRepository->find($id);
        if (!$lista) {
            return $this->json(['error' => 'Lista de lectura no encontrada.'], 404);
        }

        $libro = $libroRepository->find($dto->libroId);
        if (!$libro) {
            return $this->json(['error' => 'Libro no encontrado.'], 404);
        }

        $libroEnLista = $em->getRepository(LibroEnLista::class)->findOneBy([
            'listaLectura' => $lista,
            'libro' => $libro,
        ]);

        if (!$libroEnLista) {
            return $this->json(['error' => 'Este libro no está en la lista.'], 404);
        }

        // ✅ Eliminar la relación libro-en-lista
        $em->remove($libroEnLista);
        $em->flush();

        return $this->json(['message' => 'Libro eliminado de la lista correctamente.'], 200);
    }
}
