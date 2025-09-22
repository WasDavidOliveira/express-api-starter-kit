import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/http';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import jwt from 'jsonwebtoken';
import appConfig from '@/configs/app.config';

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const route = '/api/v1/auth/me';

describe('Auth Middleware', () => {
  setupTestDB();

  it('deve permitir acesso com token válido', async () => {
    const { user, token } = await UserFactory.createUserAndGetToken();

    const response = await request(server)
      .get(route)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.user).toHaveProperty('id', user.id);
    expect(response.body.user).toHaveProperty('email', user.email);
  });

  it('deve rejeitar acesso sem header de autorização', async () => {
    const response = await request(server).get(route);

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token não fornecido');
  });

  it('deve rejeitar acesso com header de autorização malformado', async () => {
    const response = await request(server)
      .get(route)
      .set('Authorization', 'InvalidFormat');

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });

  it('deve rejeitar acesso com token inválido', async () => {
    const invalidToken = 'invalid.token.here';

    const response = await request(server)
      .get(route)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });

  it('deve rejeitar acesso com token expirado', async () => {
    const expiredToken = jwt.sign({ id: 1 }, appConfig.jwtSecret as string, {
      expiresIn: '-1h',
    });

    const response = await request(server)
      .get(route)
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });

  it('deve rejeitar acesso com token assinado com secret diferente', async () => {
    const wrongSecretToken = jwt.sign({ id: 1 }, 'wrong-secret', {
      expiresIn: '24h',
    });

    const response = await request(server)
      .get(route)
      .set('Authorization', `Bearer ${wrongSecretToken}`);

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });

  it('deve definir userId no request quando token é válido', async () => {
    const { user, token } = await UserFactory.createUserAndGetToken();

    const response = await request(server)
      .get(route)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);

    expect(response.body.user.id).toBe(user.id);
  });

  it('deve rejeitar acesso com Bearer sem token', async () => {
    const response = await request(server)
      .get(route)
      .set('Authorization', 'Bearer');

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });

  it('deve rejeitar acesso com token vazio', async () => {
    const response = await request(server)
      .get(route)
      .set('Authorization', 'Bearer ');

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toBe('Token inválido');
  });
});
