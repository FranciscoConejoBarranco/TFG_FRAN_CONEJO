<?php

namespace App\Controller;

use App\Dto\CrearListaLecturaDTO;
use App\Entity\ListaLectura;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\Entity\User;

class ListaLecturaController extends AbstractController
{
    #[Route('api/lista-lectura/crear', name: 'crear_lista_lectura', methods: ['POST'])]
    public function crearListaLectura(
        #[MapRequestPayload] CrearListaLecturaDTO $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();

        if (!$usuario) {
            return $this->json(['message' => 'Usuario no autenticado.'], 401);
        }

        $email = $usuario->getUserIdentifier(); // o $usuario->getEmail() si tu clase User tiene el método

        $usuarioEntity = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$usuarioEntity) {
            return $this->json(['message' => 'No se encontró el usuario en la base de datos.'], 404);
        }

        $listaExistente = $em->getRepository(ListaLectura::class)
            ->findOneBy(['nombre' => $dto->nombre, 'usuario' => $usuarioEntity]);

        if ($listaExistente) {
            return $this->json([
                'message' => 'Ya existe una lista con ese nombre para este usuario.',
                'listaId' => $listaExistente->getId(),
                'nombre' => $listaExistente->getNombre()
            ], 409);
        }

        $lista = new ListaLectura();
        $lista->setNombre($dto->nombre);
        $lista->setUsuario($usuarioEntity); // Aquí ya usas el objeto real
        $lista->setFechaCreacion(new \DateTimeImmutable());

        $em->persist($lista);
        $em->flush();

        return $this->json([
            'message' => 'Lista creada correctamente.',
            'listaId' => $lista->getId(),
            'nombre' => $lista->getNombre()
        ], 201);
    }


    #[Route('api/lista-lectura', name: 'listar_listas_lectura', methods: ['GET'])]
    public function listarListasLectura(EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();
        $listas = $em->getRepository(ListaLectura::class)->findBy(['usuario' => $usuario]);

        $resultado = array_map(function (ListaLectura $lista) {
            return [
                'id' => $lista->getId(),
                'nombre' => $lista->getNombre(),
                'fechaCreacion' => $lista->getFechaCreacion()?->format('Y-m-d H:i:s'),
                'usuario' => $lista->getUsuario()?->getId(),
            ];
        }, $listas);

        return $this->json($resultado);
    }

    #[Route('api/lista-lectura/{id}', name: 'detalle_lista_lectura', methods: ['GET'])]
    public function detalleListaLectura(int $id, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();
        $lista = $em->getRepository(ListaLectura::class)->findOneBy(['id' => $id, 'usuario' => $usuario]);

        if (!$lista) {
            return $this->json(['message' => 'Lista no encontrada o no pertenece al usuario.'], 404);
        }

        return $this->json([
            'id' => $lista->getId(),
            'nombre' => $lista->getNombre(),
            'fechaCreacion' => $lista->getFechaCreacion()?->format('Y-m-d H:i:s'),
            'usuario' => $lista->getUsuario()?->getId(),
            'libros' => array_map(function ($libroEnLista) {
                return [
                    'libroId' => $libroEnLista->getLibro()->getId(),
                    'titulo' => $libroEnLista->getLibro()->getTitulo(),
                    'estadoLectura' => $libroEnLista->getEstadoLectura(),
                ];
            }, $lista->getLibroEnListas()->toArray())
        ]);
    }

    #[Route('api/lista-lectura/{id}', name: 'actualizar_lista_lectura', methods: ['PUT'])]
    public function actualizarListaLectura(
        int $id,
        #[MapRequestPayload] CrearListaLecturaDTO $dto,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();
        $lista = $em->getRepository(ListaLectura::class)->findOneBy(['id' => $id, 'usuario' => $usuario]);

        if (!$lista) {
            return $this->json(['message' => 'Lista no encontrada o no pertenece al usuario.'], 404);
        }

        $lista->setNombre($dto->nombre);
        $em->flush();

        return $this->json([
            'message' => 'Lista actualizada correctamente.',
            'listaId' => $lista->getId(),
            'nombre' => $lista->getNombre()
        ]);
    }

    #[Route('api/lista-lectura/{id}', name: 'eliminar_lista_lectura', methods: ['DELETE'])]
    public function eliminarListaLectura(int $id, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();
        $lista = $em->getRepository(ListaLectura::class)->findOneBy(['id' => $id, 'usuario' => $usuario]);

        if (!$lista) {
            return $this->json(['message' => 'Lista no encontrada o no pertenece al usuario.'], 404);
        }

        $em->remove($lista);
        $em->flush();

        return $this->json(['message' => 'Lista eliminada correctamente.']);
    }
}
