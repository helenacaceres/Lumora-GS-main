-- Criação da Tabela para Carreiras em IA
USE gs_ai; 

CREATE TABLE IF NOT EXISTS CarreirasIA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_carreira VARCHAR(100) NOT NULL,
    competencia_chave VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);