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
        $review = $em->getRepository(Review::class)->find($id);

        if (!$review) {
            return $this->json(['message' => 'Review no encontrada.'], 404);
        }

        // Solo permitir editar si es el autor o superadmin
        if ($review->getUsuario() !== $usuario && !$this->isGranted('ROLE_SUPERADMIN')) {
            return $this->json(['message' => 'No tienes permiso para editar esta review.'], 403);
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
        $review = $em->getRepository(Review::class)->find($id);

        if (!$review) {
            return $this->json(['message' => 'Review no encontrada.'], 404);
        }

        // Solo permitir editar si es el autor o superadmin
        if ($review->getUsuario() !== $usuario && !$this->isGranted('ROLE_SUPERADMIN')) {
            return $this->json(['message' => 'No tienes permiso para editar esta review.'], 403);
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
            ->orderBy('r.fechaCreacion', 'DESC')
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

        // Obtener la review del usuario autenticado
        $usuario = $this->getUser();
        $miReview = null;
        if ($usuario) {
            $reviewUsuario = $em->getRepository(Review::class)->findOneBy([
                'usuario' => $usuario,
                'libro' => $libro
            ]);
            if ($reviewUsuario) {
                $miReview = [
                    'id' => $reviewUsuario->getId(),
                    'contenido' => $reviewUsuario->getContenido(),
                    'valoracion' => $reviewUsuario->getValoracion(),
                    'usuarioId' => $reviewUsuario->getUsuario()?->getId(),
                    'fecha' => $reviewUsuario->getFechaCreacion()?->format('Y-m-d H:i'),
                ];
            }
        }

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
            'miReview' => $miReview,
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



    #[Route('api/usuario/reviews', name: 'mis_reviews', methods: ['GET'])]
    public function listarMisReviews(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();
        if (!$usuario) {
            return $this->json(['message' => 'Usuario no autenticado.'], 401);
        }

        // Parámetros de paginación
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(5, (int) $request->query->get('limit', 10)));
        $offset = ($page - 1) * $limit;

        // Obtener reviews del usuario con información del libro
        $queryBuilder = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->leftJoin('r.libro', 'l')
            ->where('r.usuario = :usuario')
            ->setParameter('usuario', $usuario)
            ->orderBy('r.fechaCreacion', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $reviews = $queryBuilder->getQuery()->getResult();

        // Contar total de reviews del usuario
        $totalQuery = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.usuario = :usuario')
            ->setParameter('usuario', $usuario);

        $total = (int) $totalQuery->getQuery()->getSingleScalarResult();

        $resultado = array_map(function (Review $review) {
            $libro = $review->getLibro();
            return [
                'id' => $review->getId(),
                'contenido' => $review->getContenido(),
                'valoracion' => $review->getValoracion(),
                'fecha' => $review->getFechaCreacion()?->format('Y-m-d H:i'),
                'libro' => [
                    'id' => $libro?->getId(),
                    'titulo' => $libro?->getTitulo(),
                    'autor' => $libro?->getAutor(),
                    'imagen' => $libro?->getImagen(),
                ]
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

    #[Route('api/reviews', name: 'todas_reviews', methods: ['GET'])]
    public function listarTodasReviews(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Parámetros de paginación
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(5, (int) $request->query->get('limit', 10))); // Entre 5 y 50
        $offset = ($page - 1) * $limit;

        // Obtener reviews con paginación
        $queryBuilder = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->orderBy('r.fechaCreacion', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $reviews = $queryBuilder->getQuery()->getResult();

        // Contar total de reviews
        $totalQuery = $em->getRepository(Review::class)
            ->createQueryBuilder('r')
            ->select('COUNT(r.id)');

        $total = (int) $totalQuery->getQuery()->getSingleScalarResult();

        $resultado = array_map(function (Review $review) {
            return [
                'id' => $review->getId(),
                'contenido' => $review->getContenido(),
                'valoracion' => $review->getValoracion(),
                'usuarioId' => $review->getUsuario()?->getId(),
                'fecha' => $review->getFechaCreacion()?->format('Y-m-d H:i'),
                'libro' => [
                    'id' => $review->getLibro()?->getId(),
                    'titulo' => $review->getLibro()?->getTitulo(),
                    'autor' => $review->getLibro()?->getAutor(),
                    'imagen' => $review->getLibro()?->getImagen(),
                ],
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
