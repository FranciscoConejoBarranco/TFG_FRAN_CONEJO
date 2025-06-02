<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250602175502 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE libro_en_lista_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE lista_lectura_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE libro_en_lista (id INT NOT NULL, lista_lectura_id INT NOT NULL, libro_id INT NOT NULL, estadolectura VARCHAR(30) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9232453FAB6D1E73 ON libro_en_lista (lista_lectura_id)');
        $this->addSql('CREATE INDEX IDX_9232453FC0238522 ON libro_en_lista (libro_id)');
        $this->addSql('CREATE TABLE lista_lectura (id INT NOT NULL, usuario_id INT DEFAULT NULL, nombre VARCHAR(100) NOT NULL, fecha_creacion TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2ADC740CDB38439E ON lista_lectura (usuario_id)');
        $this->addSql('COMMENT ON COLUMN lista_lectura.fecha_creacion IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE libro_en_lista ADD CONSTRAINT FK_9232453FAB6D1E73 FOREIGN KEY (lista_lectura_id) REFERENCES lista_lectura (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE libro_en_lista ADD CONSTRAINT FK_9232453FC0238522 FOREIGN KEY (libro_id) REFERENCES libro (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE lista_lectura ADD CONSTRAINT FK_2ADC740CDB38439E FOREIGN KEY (usuario_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE libro_en_lista_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE lista_lectura_id_seq CASCADE');
        $this->addSql('ALTER TABLE libro_en_lista DROP CONSTRAINT FK_9232453FAB6D1E73');
        $this->addSql('ALTER TABLE libro_en_lista DROP CONSTRAINT FK_9232453FC0238522');
        $this->addSql('ALTER TABLE lista_lectura DROP CONSTRAINT FK_2ADC740CDB38439E');
        $this->addSql('DROP TABLE libro_en_lista');
        $this->addSql('DROP TABLE lista_lectura');
    }
}
