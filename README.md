## Projeto 2 da Trilha Ignite de Node.Js
Stack Utilizada:
Backend:
- TypeScript
- Fastify
- tsx
- zod
- vitest
- tsup

Dados:
- Sqlite3 (dev e test)
- Postgres 15 (prd)
- knex (query builder)

Infra:
- render
- github

---

## Requisitos
### RF
1. [x] O usuário deve poder criar uma nova transação;
2. [x] O usuário deve poder obter um resumo da sua conta;
3. [x] O usuário deve poser listar todas as transações que já ocorreram;
4. [x] O usuário deve poder visualizar uma transação única.

### RN
1. [x] A transação pode ser do tipo crédito que somará ao valor total, ou débito que subtrairá do valor total;
2. [x] Deve ser possível identificarmos o usuário entre as requisições;
3. [x] O usuário só poderá visualizar transações que ele criou.

### RNF
--