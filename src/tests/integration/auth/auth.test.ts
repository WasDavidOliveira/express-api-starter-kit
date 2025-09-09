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
    const userData = UserFactory.build().make();

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
    const { loginData } = await UserFactory.build().createAndGetLoginData();

    const response = await request(server)
      .post(`${apiUrl}/login`)
      .send(loginData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Login realizado com sucesso.');
    expect(response.body.token).toHaveProperty('accessToken');
    expect(response.body.token).toHaveProperty('expiresIn');
    expect(response.body.token).toHaveProperty('tokenType', 'Bearer');
  });

  it('deve solicitar recuperação de senha e retornar token de reset', async () => {
    const { user } = await UserFactory.build().create();

    const response = await request(server)
      .post(`${apiUrl}/forgot-password`)
      .send({ email: user.email });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Se existir, enviaremos instruções para o email informado.');
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('deve redefinir a senha com token válido e permitir login com a nova senha', async () => {
    const { user } = await UserFactory.build().create();

    const forgotResponse = await request(server)
      .post(`${apiUrl}/forgot-password`)
      .send({ email: user.email });

    const resetToken: string = forgotResponse.body.token;

    const newPassword = 'novaSenha123';

    const resetResponse = await request(server)
      .post(`${apiUrl}/reset-password`)
      .send({ token: resetToken, password: newPassword });

    expect(resetResponse.status).toBe(StatusCode.OK);
    expect(resetResponse.body.message).toBe('Senha redefinida com sucesso.');

    const loginResponse = await request(server)
      .post(`${apiUrl}/login`)
      .send({ email: user.email, password: newPassword });

    expect(loginResponse.status).toBe(StatusCode.OK);
    expect(loginResponse.body.message).toBe('Login realizado com sucesso.');
    expect(loginResponse.body.token).toHaveProperty('accessToken');
  });
});
