<?php

namespace App\Controller;

use App\Dto\LibroRequest;
use App\Entity\Libro;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\LibroApiService;

class LibroController extends AbstractController
{
    #[Route('/importar-libros', name: 'api_importar_libros', methods: ['POST'])]
    public function importarLibrosDesdeGoogleBooks(
        HttpClientInterface $httpClient,
        EntityManagerInterface $em
    ): JsonResponse {
        $query = 'fantasy';
        $url = 'https://www.googleapis.com/books/v1/volumes?q=' . urlencode($query);

        $response = $httpClient->request('GET', $url);
        $data = $response->toArray();

        foreach ($data['items'] ?? [] as $item) {
            $info = $item['volumeInfo'];

            $libro = new Libro();
            $libro->setTitulo($info['title'] ?? 'Sin título');
            $libro->setAutor($info['authors'][0] ?? 'Autor desconocido');
            $libro->setGenero($info['categories'][0] ?? 'Desconocido');
            $libro->setSinopsis($info['description'] ?? 'Sin sinopsis');
            $libro->setImagen($info['imageLinks']['thumbnail'] ?? null);

            $em->persist($libro);
        }

        $em->flush();

        return new JsonResponse(['mensaje' => 'Libros importados correctamente']);
    }


    #[Route('/libros/buscar', name: 'buscar_libros', methods: ['GET'])]
    public function buscarLibro(
        Request $request,
        EntityManagerInterface $em,
        LibroApiService $api
    ): JsonResponse {
        $titulo = $request->query->get('titulo');

        // 1. Buscar en base de datos
        $libro = $em->getRepository(Libro::class)->findOneBy(['titulo' => $titulo]);

        if ($libro) {
            return $this->json($libro);
        }

        // 2. Buscar en OpenLibrary
        $datos = $api->buscarLibroPorTitulo($titulo);

        if (!$datos) {
            return new JsonResponse(['mensaje' => 'No se encontró el libro'], 404);
        }

        // 3. Guardar en base de datos
        $libro = new Libro();
        $libro->setTitulo($datos['titulo']);
        $libro->setAutor($datos['autor']);
        $libro->setGenero($datos['genero']);
        $libro->setSinopsis($datos['sinopsis']);
        $libro->setImagen($datos['imagen']);

        $em->persist($libro);
        $em->flush();

        return $this->json($libro, 201);
    }
}
