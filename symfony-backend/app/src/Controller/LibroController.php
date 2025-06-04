<?php

namespace App\Controller;

use App\Entity\Libro;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\LibroApiService;

class LibroController extends AbstractController
{
    #[Route('/libros/buscar', name: 'buscar_libros', methods: ['GET'])]
    public function buscarLibro(
        Request $request,
        EntityManagerInterface $em,
        LibroApiService $api
    ): JsonResponse {
        try {
            $titulo = $request->query->get('titulo');

            if (!$titulo) {
                return new JsonResponse(['error' => 'El parámetro título es requerido'], 400);
            }

            // 1. Buscar en base de datos
            $libro = $this->buscarLibroFlexible($em, $titulo);

            if ($libro) {
                // ✅ USAR GRUPOS DE SERIALIZACIÓN
                return $this->json($libro, 200, [], ['groups' => ['libro:read']]);
            }

            // 2. Buscar en API externa
            $datosLibro = $api->buscarLibroPorTitulo($titulo);

            if (!$datosLibro) {
                return new JsonResponse(['mensaje' => 'No se encontró el libro'], 404);
            }

            // 3. Verificar una vez más antes de crear
            $libroExistente = $this->buscarLibroFlexible($em, $datosLibro['titulo']);

            if ($libroExistente) {
                // ✅ USAR GRUPOS DE SERIALIZACIÓN
                return $this->json($libroExistente, 200, [], ['groups' => ['libro:read']]);
            }

            // 4. Crear y guardar nuevo libro
            $libro = new Libro();
            $libro->setTitulo($datosLibro['titulo']);
            $libro->setAutor($datosLibro['autor']);
            $libro->setGenero($datosLibro['genero']);
            $libro->setSinopsis($datosLibro['sinopsis']);
            $libro->setImagen($datosLibro['imagen']);

            $em->persist($libro);
            $em->flush();

            // ✅ USAR GRUPOS DE SERIALIZACIÓN
            return $this->json($libro, 201, [], ['groups' => ['libro:read']]);

        } catch (\Exception $e) {
            error_log('Error en buscarLibro: ' . $e->getMessage());
            
            return new JsonResponse([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    private function buscarLibroFlexible(EntityManagerInterface $em, string $titulo): ?Libro
    {
        $tituloLimpio = $this->limpiarTitulo($titulo);

        // 1. Búsqueda exacta
        $libro = $em->getRepository(Libro::class)
            ->createQueryBuilder('l')
            ->where('LOWER(TRIM(l.titulo)) = LOWER(TRIM(:titulo))')
            ->setParameter('titulo', $titulo)
            ->getQuery()
            ->getOneOrNullResult();

        if ($libro) {
            return $libro;
        }

        // 2. Búsqueda por palabras clave
        $palabras = explode(' ', $tituloLimpio);
        $palabras = array_filter($palabras, function ($palabra) {
            return strlen($palabra) > 2;
        });

        if (count($palabras) >= 2) {
            $qb = $em->getRepository(Libro::class)->createQueryBuilder('l');

            foreach ($palabras as $index => $palabra) {
                $qb->andWhere("LOWER(l.titulo) LIKE LOWER(:palabra{$index})")
                    ->setParameter("palabra{$index}", "%{$palabra}%");
            }

            return $qb->getQuery()->getOneOrNullResult();
        }

        return null;
    }

    private function limpiarTitulo(string $titulo): string
    {
        $titulo = strtolower(trim($titulo));
        $titulo = preg_replace('/[^\w\s]/', ' ', $titulo);
        $titulo = preg_replace('/\s+/', ' ', $titulo);

        return $titulo;
    }
}
