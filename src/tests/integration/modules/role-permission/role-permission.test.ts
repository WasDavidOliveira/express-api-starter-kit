import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { RoleFactory } from '@/tests/factories/role/role.factory';
import { PermissionFactory } from '@/tests/factories/permission/permission.factory';
import { RolePermissionFactory } from '@/tests/factories/role-permission/role-permission.factory';
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

const apiUrl: string = '/api/v1/roles-permissions';

describe('Role Permissions', () => {
  setupTestDB();

  it('deve associar uma permissão a um perfil com sucesso', async () => {
    const role = await RoleFactory.createRole();
    const permission = await PermissionFactory.createPermission();

    const response = await request(server)
      .post(`${apiUrl}/attach`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roleId: role.id,
        permissionId: permission.id,
      });

    expect(response.status).toBe(StatusCode.CREATED);
    expect(response.body.message).toBe(
      'Permissão de role associada com sucesso.',
    );
  });

  it('deve remover uma permissão de um perfil com sucesso', async () => {
    const role = await RoleFactory.createRole();
    const permission = await PermissionFactory.createPermission();

    await RolePermissionFactory.attachPermissionToRole(role.id, permission.id);

    const response = await request(server)
      .post(`${apiUrl}/detach`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roleId: role.id,
        permissionId: permission.id,
      });

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe(
      'Permissão de role removida com sucesso.',
    );
  });

  it('deve listar todas as permissões de um perfil', async () => {
    const { role, permissions } =
      await RolePermissionFactory.createRoleWithPermissions(3);

    const response = await request(server)
      .get(`${apiUrl}/${role.id}/all`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body).toHaveLength(permissions.length);
  });

  it('deve retornar erro ao tentar associar permissão inexistente', async () => {
    const role = await RoleFactory.createRole();

    const response = await request(server)
      .post(`${apiUrl}/attach`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roleId: role.id,
        permissionId: 9999,
      });

    expect(response.status).toBe(StatusCode.NOT_FOUND);
  });
});
