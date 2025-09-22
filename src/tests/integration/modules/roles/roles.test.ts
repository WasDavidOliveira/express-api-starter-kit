import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/http';
import { RoleFactory } from '@/tests/factories/role/role.factory';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';

let server: Server;
let token: string;

beforeAll(async () => {
  server = app.listen();

  token = UserFactory.generateJwtToken(1);
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/roles';

describe('Perfis (Roles)', () => {
  setupTestDB();

  it('deve criar um novo perfil com sucesso', async () => {
    const roleData = RoleFactory.makeRoleData();

    const response = await request(server)
      .post(apiUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(roleData);

    expect(response.status).toBe(StatusCode.CREATED);
    expect(response.body.message).toBe('Role criada com sucesso.');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', roleData.name);
    expect(response.body.data).toHaveProperty(
      'description',
      roleData.description,
    );
  });

  it('deve buscar um perfil pelo ID', async () => {
    const role = await RoleFactory.createRole();

    const response = await request(server)
      .get(`${apiUrl}/${role.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Role encontrada com sucesso.');
    expect(response.body.data).toHaveProperty('id', role.id);
    expect(response.body.data).toHaveProperty('name', role.name);
    expect(response.body.data).toHaveProperty('description', role.description);
  });

  it('deve atualizar um perfil existente', async () => {
    const role = await RoleFactory.createRole();

    const updatedData = {
      name: `${role.name}_updated`,
      description: 'Descrição atualizada para testes',
    };

    const response = await request(server)
      .put(`${apiUrl}/${role.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Role atualizada com sucesso.');
    expect(response.body.data).toHaveProperty('id', role.id);
    expect(response.body.data).toHaveProperty('name', updatedData.name);
    expect(response.body.data).toHaveProperty(
      'description',
      updatedData.description,
    );
  });

  it('deve excluir um perfil existente', async () => {
    const role = await RoleFactory.createRole();

    const response = await request(server)
      .delete(`${apiUrl}/${role.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Role deletada com sucesso.');

    const checkResponse = await request(server)
      .get(`${apiUrl}/${role.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkResponse.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao buscar um perfil inexistente', async () => {
    const response = await request(server)
      .get(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao atualizar um perfil inexistente', async () => {
    const updatedData = {
      name: 'Role Inexistente',
      description: 'Tentativa de atualizar uma role que não existe',
    };

    const response = await request(server)
      .put(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao excluir um perfil inexistente', async () => {
    const response = await request(server)
      .delete(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });
});
