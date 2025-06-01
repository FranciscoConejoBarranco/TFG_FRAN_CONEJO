<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Psr\Log\LoggerInterface;

class LibroApiService
{
    private const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
    private const MAX_RESULTS = 5;
    private const LANG_RESTRICT = 'es';

    public function __construct(
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ) {}

    public function buscarLibroPorTitulo(string $titulo): ?array
    {
        try {
            $response = $this->realizarBusqueda($titulo);
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

    private function realizarBusqueda(string $titulo): array
    {
        $response = $this->httpClient->request('GET', self::GOOGLE_BOOKS_API, [
            'query' => [
                'q' => 'intitle:' . trim($titulo),
                'langRestrict' => self::LANG_RESTRICT,
                'maxResults' => self::MAX_RESULTS,
                'printType' => 'books'
            ],
            'timeout' => 10 // Timeout de 10 segundos
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \Exception('API response error: ' . $response->getStatusCode());
        }

        return $response->toArray();
    }

    private function procesarRespuesta(array $data): ?array
    {
        if (empty($data['items'])) {
            return null;
        }

        $book = $data['items'][0]['volumeInfo'];
        
        return [
            'titulo' => $this->extraerTitulo($book),
            'autor' => $this->extraerAutor($book),
            'genero' => $this->extraerGenero($book),
            'sinopsis' => $this->extraerSinopsis($book),
            'imagen' => $this->extraerImagen($book),
        ];
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
        
        // Unir múltiples autores con coma
        return implode(', ', $book['authors']);
    }

    private function extraerGenero(array $book): string
    {
        return $book['categories'][0] ?? 'Desconocido';
    }

    private function extraerSinopsis(array $book): string
    {
        $description = $book['description'] ?? 'Sin sinopsis';
        
        // Limpiar HTML tags si existen
        return strip_tags($description);
    }

    private function extraerImagen(array $book): ?string
    {
        return $book['imageLinks']['thumbnail'] ?? 
               $book['imageLinks']['smallThumbnail'] ?? 
               null;
    }
}