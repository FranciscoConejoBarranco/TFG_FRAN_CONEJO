<?php

namespace App\Controller;

use App\Dto\CrearReviewDTO;
use App\Entity\Libro;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpFoundation\Request;

class ReviewController extends AbstractController
{
    #[Route('api/review/crear', name: 'crear_review', methods: ['POST'])]
    public function crearReview(
        #[MapRequestPayload] CrearReviewDTO $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();
        if (!$usuario) {
            return $this->json(['message' => 'Usuario no autenticado.'], 401);
        }

        $libro = $em->getRepository(Libro::class)->find($dto->libroId);
        if (!$libro) {
            return $this->json(['message' => 'Libro no encontrado.'], 404);
        }

        $reviewExistente = $em->getRepository(Review::class)->findOneBy([
            'usuario' => $usuario,
            'libro' => $libro
        ]);

        if ($reviewExistente) {
            return $this->json(['message' => 'Ya has creado una review para este libro.'], 409);
        }

        $review = new Review();
        $review->setContenido($dto->contenido);
        $review->setLibro($libro);
        $review->setUsuario($usuario);
        $review->setFechaCreacion(new \DateTimeImmutable());
        $review->setValoracion($dto->rating); // <-- IMPORTANTE

        $em->persist($review);
        $em->flush();

        return $this->json([
            'message' => 'Review creada correctamente.',
            'reviewId' => $review->getId(),
        ], 201);
    }

    #[Route('api/review/{id}', name: 'editar_review', methods: ['PUT'])]
    public function editarReview(
        int $id,
        #[MapRequestPayload] CrearReviewDTO $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();
        $review = $em->getRepository(Review::class)->findOneBy(['id' => $id, 'usuario' => $usuario]);

        if (!$review) {
            return $this->json(['message' => 'Review no encontrada o no te pertenece.'], 404);
        }

        $review->setContenido($dto->contenido);
        $review->setValoracion($dto->rating); // <-- IMPORTANTE
        $em->flush();

        return $this->json(['message' => 'Review actualizada correctamente.']);
    }

    #[Route('api/review/{id}', name: 'eliminar_review', methods: ['DELETE'])]
    public function eliminarReview(int $id, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();
        $review = $em->getRepository(Review::class)->findOneBy(['id' => $id, 'usuario' => $usuario]);

        if (!$review) {
            return $this->json(['message' => 'Review no encontrada o no te pertenece.'], 404);
        }

        $em->remove($review);
        $em->flush();

        return $this->json(['message' => 'Review eliminada correctamente.']);
    }

    #[Route('api/libro/{id}/reviews', name: 'reviews_por_libro', methods: ['GET'])]
    public function listarReviewsPorLibro(
        int $id,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $libro = $em->getRepository(Libro::class)->find($id);
        if (!$libro) {
            return $this->json(['message' => 'Libro no encontrado.'], 404);
        }

        // Parámetros de paginación
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(5, (int) $request->query->get('limit', 10))); // Entre 5 y 50
        $offset = ($page - 1) * $limit;

        // Obtener reviews con paginación
        $queryBuilder = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->where('r.libro = :libro')
            ->setParameter('libro', $libro)
            ->orderBy('r.fechaCreacion', 'DESC') // Más recientes primero
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $reviews = $queryBuilder->getQuery()->getResult();

        // Contar total de reviews
        $totalQuery = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.libro = :libro')
            ->setParameter('libro', $libro);

        $total = (int) $totalQuery->getQuery()->getSingleScalarResult();

        $resultado = array_map(function (Review $review) {
            return [
                'id' => $review->getId(),
                'contenido' => $review->getContenido(),
                'valoracion' => $review->getValoracion(),
                'usuarioId' => $review->getUsuario()?->getId(),
                'fecha' => $review->getFechaCreacion()?->format('Y-m-d H:i'),
            ];
        }, $reviews);

        return $this->json([
            'reviews' => $resultado,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => ceil($total / $limit),
                'totalReviews' => $total,
                'limit' => $limit,
                'hasNext' => $page < ceil($total / $limit),
                'hasPrevious' => $page > 1
            ]
        ]);
    }
}
