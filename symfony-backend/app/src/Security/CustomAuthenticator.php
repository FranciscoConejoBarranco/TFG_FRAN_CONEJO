<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class CustomAuthenticator extends AbstractAuthenticator
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function supports(Request $request): ?bool
    {
        // Activar si existe token en cabecera o en cookie
        return $request->headers->has('X-AUTH-TOKEN') || $request->cookies->has('codearts_token');
    }

    public function authenticate(Request $request): Passport
    {
        // Obtener token de cabecera o cookie
        $apiToken = $request->headers->get('X-AUTH-TOKEN') ?? $request->cookies->get('codearts_token');

        if (null === $apiToken) {
            throw new CustomUserMessageAuthenticationException('Se necesita token para autenticar.');
        }

        try {
            // Decodificar el token usando la clave secreta y el algoritmo
            $decoded = JWT::decode($apiToken, new Key($_ENV['JWT_SECRET'], 'HS512'));

            // Buscar el usuario con el ID del token (se guardó en el campo 'aud')
            $user = $this->em->getRepository(User::class)->findOneBy(['id' => $decoded->aud]);

            if (!$user) {
                throw new CustomUserMessageAuthenticationException('Usuario no encontrado.');
            }

            return new SelfValidatingPassport(new UserBadge($user->getEmail()));
        } catch (\Throwable $e) {
            throw new CustomUserMessageAuthenticationException('Token inválido o expirado.');
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Continuar normalmente
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}
