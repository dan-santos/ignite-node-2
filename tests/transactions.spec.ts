import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { execSync } from 'child_process';

const baseUrl = '/v1/transactions';

beforeAll(async () => {
  await app.ready();
});

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all');
  execSync('npm run knex migrate:latest');
});

afterAll(async () => {
  await app.close();
});

describe('on receive a user request to transaction routes', () => {
  it('should be able to create a transaction', async () => {
    const response = await request(app.server)
      .post(`${baseUrl}`)
      .send({
        title: 'test transaction',
        amount: 1,
        type: 'credit',
      });
    
    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all user transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post(`${baseUrl}`)
      .send({
        title: 'test transaction',
        amount: 1,
        type: 'credit',
      });
    
    const cookies = createTransactionResponse.get('Set-Cookie');
    
    const transactions = await request(app.server)
      .get(baseUrl)
      .set('Cookie', cookies);

    expect(transactions.statusCode).toEqual(200);
    expect(transactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'test transaction',
        amount: 1,
      }),
    ]);
  });

  it('should be able to get specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post(`${baseUrl}`)
      .send({
        title: 'test transaction',
        amount: 1,
        type: 'credit',
      });
    
    const cookies = createTransactionResponse.get('Set-Cookie');
    
    const transactions = await request(app.server)
      .get(baseUrl)
      .set('Cookie', cookies);

    const transactionId = transactions.body.transactions[0].id;

    const transaction = await request(app.server)
      .get(`${baseUrl}/${transactionId}`)
      .set('Cookie', cookies);

    expect(transaction.statusCode).toEqual(200);
    expect(transaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'test transaction',
        amount: 1,
      }),
    );
  });

  it('should be able to get summary of transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post(`${baseUrl}`)
      .send({
        title: 'credit transaction',
        amount: 10,
        type: 'credit',
      });
    
    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post(`${baseUrl}`)
      .set('Cookie', cookies)
      .send({
        title: 'debit transaction',
        amount: 5,
        type: 'debit',
      });

    const getSummary = await request(app.server)
      .get(`${baseUrl}/summary`)
      .set('Cookie', cookies);

    expect(getSummary.statusCode).toEqual(200);
    expect(getSummary.body.summary).toEqual({ amount: 5 });
  });
});