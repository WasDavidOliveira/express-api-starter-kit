import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/auth';

describe('Autenticação', () => {
  setupTestDB();

  it('deve cadastrar um novo usuário com sucesso', async () => {
    const userData = UserFactory.makeUserData();

    const response = await request(server)
      .post(`${apiUrl}/register`)
      .send(userData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário criado com sucesso.');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name', userData.name);
    expect(response.body.user).toHaveProperty('email', userData.email);
  });

  it('deve autenticar um usuário e retornar um token', async () => {
    const { loginData } = await UserFactory.createUserAndGetLoginData();

    const response = await request(server)
      .post(`${apiUrl}/login`)
      .send(loginData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Login realizado com sucesso.');
    expect(response.body.token).toHaveProperty('accessToken');
    expect(response.body.token).toHaveProperty('expiresIn');
    expect(response.body.token).toHaveProperty('tokenType', 'Bearer');
  });
});
