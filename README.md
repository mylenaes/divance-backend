# Divance — Backend API

Sistema de Gestão Financeira Pessoal · MVP

## Stack

- **Node.js** + **Express 5**
- **PostgreSQL** (via `pg`)
- **JWT** para autenticação
- **bcrypt** para hashing de senhas
- **dotenv** · **cors** · **nodemon**

---

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=seu_segredo_aqui
PORT=3000
```

### 3. Criar o banco de dados

Execute o script `database.sql` no seu PostgreSQL:

```bash
psql -U seu_usuario -d seu_banco -f database.sql
```

Isso cria as tabelas `usuario`, `categoria` e `transacao`, além de inserir as 7 categorias pré-definidas automaticamente.

### 4. Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento (com reload automático)
npm run dev
```

---

## Estrutura de Pastas

```
src/
├── app.js                        # Configuração do Express e rotas
├── server.js                     # Ponto de entrada
├── controllers/
│   ├── authController.js         # Registro, login, logout, recuperação de senha
│   ├── transactionController.js  # CRUD de transações
│   ├── dashboardController.js    # Resumo financeiro e gráfico por categoria
│   └── categoryController.js     # Listagem de categorias
├── database/
│   └── connection.js             # Pool de conexão PostgreSQL
├── middlewares/
│   └── authMiddleware.js         # Verificação do token JWT
└── routes/
    ├── authRoutes.js
    ├── transactionRoutes.js
    ├── dashboardRoutes.js
    └── categoryRoutes.js
```

---

## Endpoints

> Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`

### Autenticação

| Método | Rota                      | Descrição                    | Auth |
|--------|---------------------------|------------------------------|------|
| POST   | `/auth/register`          | Cadastrar novo usuário       |      |
| POST   | `/auth/login`             | Login (retorna JWT)          |      |
| POST   | `/auth/logout`            | Logout                       | 🔒   |
| POST   | `/auth/recover-password`  | Recuperação de senha (MVP)   |      |

#### POST /auth/register
```json
// Body
{ "nome": "João", "email": "joao@email.com", "senha": "123456" }

// Response 201
{ "id": 1, "nome": "João", "email": "joao@email.com" }
```

#### POST /auth/login
```json
// Body
{ "email": "joao@email.com", "senha": "123456" }

// Response 200
{
  "token": "eyJ...",
  "usuario": { "id": 1, "nome": "João", "email": "joao@email.com" }
}
```

#### POST /auth/recover-password
```json
// Body
{ "email": "joao@email.com" }

// Response 200 (resposta genérica — não expõe quais e-mails existem)
{ "message": "Se este e-mail estiver cadastrado, você receberá as instruções de recuperação." }
```

---

### Categorias 🔒

| Método | Rota           | Descrição                       |
|--------|----------------|---------------------------------|
| GET    | `/categories`  | Listar todas as categorias      |

```json
// Response 200
[
  { "id": 1, "nome": "Alimentação" },
  { "id": 2, "nome": "Educação" },
  { "id": 3, "nome": "Lazer" },
  { "id": 4, "nome": "Moradia" },
  { "id": 5, "nome": "Outros" },
  { "id": 6, "nome": "Saúde" },
  { "id": 7, "nome": "Transporte" }
]
```

---

### Transações 🔒

| Método | Rota                 | Descrição                  |
|--------|----------------------|----------------------------|
| POST   | `/transactions`      | Criar transação            |
| GET    | `/transactions`      | Listar transações          |
| PUT    | `/transactions/:id`  | Editar transação           |
| DELETE | `/transactions/:id`  | Excluir transação          |

#### POST /transactions
```json
// Body
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "tipo": "despesa",
  "data": "2026-06-22",
  "categoria_id": 1
}

// Response 201 — objeto da transação criada
```

#### GET /transactions
```json
// Response 200
[
  {
    "id": 1,
    "descricao": "Supermercado",
    "valor": "150.00",
    "tipo": "despesa",
    "data": "2026-06-22",
    "categoria_id": 1,
    "categoria": "Alimentação",
    "criado_em": "...",
    "atualizado_em": "..."
  }
]
```

#### PUT /transactions/:id
```json
// Body — mesmos campos do POST
// Response 200 — objeto atualizado
// Response 404 — se não encontrar ou não pertencer ao usuário
```

#### DELETE /transactions/:id
```json
// Response 200
{ "message": "Transação removida com sucesso" }

// Response 404 — se não encontrar ou não pertencer ao usuário
```

---

### Dashboard 🔒

| Método | Rota         | Descrição              |
|--------|--------------|------------------------|
| GET    | `/dashboard` | Resumo financeiro      |

```json
// Response 200
{
  "saldo": 1350.00,
  "totalReceitas": 3000.00,
  "totalDespesas": 1650.00,
  "ultimasTransacoes": [
    {
      "id": 5,
      "descricao": "Salário",
      "valor": "3000.00",
      "tipo": "receita",
      "data": "2026-06-01",
      "categoria": "Outros"
    }
  ],
  "gastosPorCategoria": [
    { "nome": "Alimentação", "total": "650.00" },
    { "nome": "Transporte",  "total": "500.00" },
    { "nome": "Lazer",       "total": "500.00" }
  ]
}
```

---

## Regras de Negócio Implementadas

| ID   | Regra                                                                 |
|------|-----------------------------------------------------------------------|
| RN01 | Saldo = total de receitas − total de despesas                         |
| RN02 | Total de receitas considera apenas transações do tipo `receita`       |
| RN03 | Total de despesas considera apenas transações do tipo `despesa`       |
| RN04 | Gráfico por categoria considera apenas `despesa`                      |
| RN05 | Transação exige descrição, valor, data, tipo e categoria              |
| RN06 | Usuário só pode editar/excluir suas próprias transações               |
| RN07 | Categorias: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Outros |
