import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { PermissionFactory } from '@/tests/factories/permission/permission.factory';
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

const apiUrl: string = '/api/v1/permissions';

describe('Permissões (Permissions)', () => {
  setupTestDB();

  it('deve criar uma nova permissão com sucesso', async () => {
    const permissionData = PermissionFactory.makePermissionData();

    const response = await request(server)
      .post(apiUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(permissionData);

    expect(response.status).toBe(StatusCode.CREATED);
    expect(response.body.message).toBe('Permissão criada com sucesso.');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', permissionData.name);
    expect(response.body.data).toHaveProperty(
      'description',
      permissionData.description
    );
    expect(response.body.data).toHaveProperty('action', permissionData.action);
  });

  it('deve buscar uma permissão pelo ID', async () => {
    const permission = await PermissionFactory.createPermission();

    const response = await request(server)
      .get(`${apiUrl}/${permission.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Permissão encontrada com sucesso.');
    expect(response.body.data).toHaveProperty('id', permission.id);
    expect(response.body.data).toHaveProperty('name', permission.name);
    expect(response.body.data).toHaveProperty(
      'description',
      permission.description
    );
    expect(response.body.data).toHaveProperty('action', permission.action);
  });

  it('deve atualizar uma permissão existente', async () => {
    const permission = await PermissionFactory.createPermission();

    const updatedData = {
      name: `${permission.name}_${Date.now()}`,
      description: 'Descrição atualizada para testes',
      action: 'update' as const,
    };

    const response = await request(server)
      .put(`${apiUrl}/${permission.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Permissão atualizada com sucesso.');
    expect(response.body.data).toHaveProperty('id', permission.id);
    expect(response.body.data).toHaveProperty('name', updatedData.name);
    expect(response.body.data).toHaveProperty(
      'description',
      updatedData.description
    );
    expect(response.body.data).toHaveProperty('action', updatedData.action);
  });

  it('deve excluir uma permissão existente', async () => {
    const permission = await PermissionFactory.createPermission();

    const response = await request(server)
      .delete(`${apiUrl}/${permission.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Permissão deletada com sucesso.');

    const checkResponse = await request(server)
      .get(`${apiUrl}/${permission.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkResponse.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao buscar uma permissão inexistente', async () => {
    const response = await request(server)
      .get(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao atualizar uma permissão inexistente', async () => {
    const updatedData = {
      name: 'Permissão Inexistente',
      description: 'Tentativa de atualizar uma permissão que não existe',
      action: 'read' as const,
    };

    const response = await request(server)
      .put(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });

  it('deve retornar erro ao excluir uma permissão inexistente', async () => {
    const response = await request(server)
      .delete(`${apiUrl}/9999`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });
});
