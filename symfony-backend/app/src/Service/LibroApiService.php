<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class LibroApiService
{
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function buscarLibroPorTitulo(string $titulo): ?array
    {
        $response = $this->httpClient->request(
            'GET',
            'https://www.googleapis.com/books/v1/volumes',
            [
                'query' => [
                    'q' => 'intitle:' . $titulo,
                    'langRestrict' => 'es', // Solo libros en español
                    'maxResults' => 5,
                    'printType' => 'books'
                ]
            ]
        );

        if ($response->getStatusCode() !== 200) {
            return null;
        }

        $data = $response->toArray();

        if (empty($data['items'])) {
            return null;
        }

        // El primer resultado
        $book = $data['items'][0]['volumeInfo'];

        return [
            'titulo' => $book['title'] ?? 'Sin título',
            'autor' => $book['authors'][0] ?? 'Autor desconocido',
            'genero' => $book['categories'][0] ?? 'Desconocido',
            'sinopsis' => $book['description'] ?? 'Sin sinopsis',
            'imagen' => $book['imageLinks']['thumbnail'] ?? null,
        ];
    }
}
