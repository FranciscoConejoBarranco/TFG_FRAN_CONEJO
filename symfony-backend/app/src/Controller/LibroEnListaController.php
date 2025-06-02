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
    
}
