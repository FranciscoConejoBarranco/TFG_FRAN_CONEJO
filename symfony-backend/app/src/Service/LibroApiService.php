<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Psr\Log\LoggerInterface;

class LibroApiService
{
    private const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
    private const MAX_RESULTS = 10; // Aumentado para más opciones
    private const LANG_RESTRICT = 'es';

    public function __construct(
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ) {}

    public function buscarLibroPorTitulo(string $titulo): ?array
    {
        try {
            // Intentar diferentes estrategias de búsqueda
            $response = $this->buscarConEstrategias($titulo);
            return $this->procesarRespuesta($response);
            
        } catch (TransportExceptionInterface $e) {
            $this->logger->error('Error en la búsqueda de libro', [
                'titulo' => $titulo,
                'error' => $e->getMessage()
            ]);
            return null;
        } catch (\Exception $e) {
            $this->logger->error('Error inesperado en búsqueda de libro', [
                'titulo' => $titulo,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    private function buscarConEstrategias(string $titulo): array
    {
        // Estrategia 1: Búsqueda exacta en título
        $response = $this->realizarBusqueda('intitle:"' . trim($titulo) . '"');
        if (!empty($response['items'])) {
            return $response;
        }

        // Estrategia 2: Búsqueda en título sin comillas
        $response = $this->realizarBusqueda('intitle:' . trim($titulo));
        if (!empty($response['items'])) {
            return $response;
        }

        // Estrategia 3: Búsqueda general
        $response = $this->realizarBusqueda(trim($titulo));
        if (!empty($response['items'])) {
            return $response;
        }

        // Estrategia 4: Búsqueda sin restricción de idioma
        return $this->realizarBusquedaSinIdioma(trim($titulo));
    }

    private function realizarBusqueda(string $query): array
    {
        $response = $this->httpClient->request('GET', self::GOOGLE_BOOKS_API, [
            'query' => [
                'q' => $query,
                'langRestrict' => self::LANG_RESTRICT,
                'maxResults' => self::MAX_RESULTS,
                'printType' => 'books',
                'orderBy' => 'relevance'
            ],
            'timeout' => 10
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \Exception('API response error: ' . $response->getStatusCode());
        }

        return $response->toArray();
    }

    private function realizarBusquedaSinIdioma(string $query): array
    {
        $response = $this->httpClient->request('GET', self::GOOGLE_BOOKS_API, [
            'query' => [
                'q' => $query,
                'maxResults' => self::MAX_RESULTS,
                'printType' => 'books',
                'orderBy' => 'relevance'
            ],
            'timeout' => 10
        ]);

        return $response->toArray();
    }

    private function procesarRespuesta(array $data): ?array
    {
        if (empty($data['items'])) {
            return null;
        }

        // Buscar el mejor resultado (el más relevante)
        $mejorLibro = $this->seleccionarMejorResultado($data['items']);
        
        return [
            'titulo' => $this->extraerTitulo($mejorLibro),
            'autor' => $this->extraerAutor($mejorLibro),
            'genero' => $this->extraerGenero($mejorLibro),
            'sinopsis' => $this->extraerSinopsis($mejorLibro),
            'imagen' => $this->extraerImagen($mejorLibro),
        ];
    }

    private function seleccionarMejorResultado(array $items): array
    {
        // Por ahora, devolver el primero, pero aquí podrías implementar
        // lógica más sofisticada para elegir el mejor resultado
        return $items[0]['volumeInfo'];
    }

    private function extraerTitulo(array $book): string
    {
        return $book['title'] ?? 'Sin título';
    }

    private function extraerAutor(array $book): string
    {
        if (empty($book['authors'])) {
            return 'Autor desconocido';
        }
        
        return implode(', ', $book['authors']);
    }

    private function extraerGenero(array $book): string
    {
        return $book['categories'][0] ?? 'Desconocido';
    }

    private function extraerSinopsis(array $book): string
    {
        $description = $book['description'] ?? 'Sin sinopsis';
        return strip_tags($description);
    }

    private function extraerImagen(array $book): ?string
    {
        return $book['imageLinks']['thumbnail'] ?? 
               $book['imageLinks']['smallThumbnail'] ?? 
               null;
    }
}
