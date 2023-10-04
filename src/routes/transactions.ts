import crypto from 'node:crypto';
import { knex } from '../database';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { checkSessionIdExists } from '../middlewares/check-session-id';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [ checkSessionIdExists ] }, async (req) => {
    const { sessionId } = req.cookies;

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select();
  
    return { transactions };
  });

  app.get('/:id', { preHandler: [ checkSessionIdExists ] }, async (req) => {
    const { sessionId } = req.cookies;
    const getTransactionDto = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionDto.parse(req.params);

    const transaction = await knex('transactions')
      .where({id, 'session_id': sessionId})
      .first();
  
    return { transaction };
  });

  app.get('/summary', { preHandler: [ checkSessionIdExists ] }, async (req) => {
    const { sessionId } = req.cookies;
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first();
  
    return { summary };
  });
  
  app.post('/', async (req, res) => {
    const createTransactionDto = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionDto.parse(req.body);

    const sessionId = req.cookies.sessionId ?? crypto.randomUUID();
    res.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });
}
