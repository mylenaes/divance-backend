-- ============================================================
--  Divance - Sistema de Gestão Financeira Pessoal
--  Script de criação do banco de dados (PostgreSQL)
--  Execute este script antes de iniciar a aplicação.
-- ============================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha_hash TEXT         NOT NULL,
  criado_em  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabela de categorias (pré-definidas pelo sistema)
CREATE TABLE IF NOT EXISTS categoria (
  id   SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

-- Seed das categorias obrigatórias (RF10 / RN07)
INSERT INTO categoria (nome) VALUES
  ('Alimentação'),
  ('Transporte'),
  ('Moradia'),
  ('Saúde'),
  ('Educação'),
  ('Lazer'),
  ('Outros')
ON CONFLICT (nome) DO NOTHING;

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacao (
  id           SERIAL PRIMARY KEY,
  descricao    VARCHAR(255)   NOT NULL,
  valor        NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  tipo         VARCHAR(10)    NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  data         DATE           NOT NULL,
  usuario_id   INTEGER        NOT NULL REFERENCES usuario(id)  ON DELETE CASCADE,
  categoria_id INTEGER        NOT NULL REFERENCES categoria(id) ON DELETE RESTRICT,
  criado_em    TIMESTAMP      NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Índices para melhorar desempenho das queries mais comuns (RNF04)
CREATE INDEX IF NOT EXISTS idx_transacao_usuario  ON transacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacao_tipo     ON transacao(tipo);
CREATE INDEX IF NOT EXISTS idx_transacao_data     ON transacao(data DESC);
CREATE INDEX IF NOT EXISTS idx_transacao_cat      ON transacao(categoria_id);
