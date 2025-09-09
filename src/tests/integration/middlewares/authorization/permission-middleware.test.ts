import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/status-code.constants';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { UserRoleFactory } from '@/tests/factories/user-role/user-role.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { seedPermissions } from '@/db/seeds/permissions.seeds';
import { seedRoles } from '@/db/seeds/roles.seeds';
import { seedRolePermissions } from '@/db/seeds/role-permissions.seeds';
import { faker } from '@faker-js/faker';

let server: Server;

beforeAll(async () => {
  server = app.listen();
  
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
});

afterAll(() => {
  server.close();
});

const route = '/api/v1/permissions';

describe('Permission Middleware', () => {
  setupTestDB();

  describe('hasPermission', () => {
    it('deve permitir acesso quando usuário tem a permissão necessária', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const adminRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'admin'),
      });

      if (adminRole) {
        await UserRoleFactory.attachRoleToUser(user.id, adminRole.id);
      }

      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.CREATED);
    });

    it('deve rejeitar acesso quando usuário não tem a permissão necessária', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const guestRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'guest'),
      });

      if (guestRole) {
        await UserRoleFactory.attachRoleToUser(user.id, guestRole.id);
      }

      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
      expect(response.body.message).toBe('Usuário não tem permissão para realizar esta ação');
    });

    it('deve rejeitar acesso quando usuário não possui nenhum papel', async () => {
      const { token } = await UserFactory.createUserAndGetToken();

      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
      expect(response.body.message).toBe('Usuário não possui nenhum papel atribuído');
    });

    it('deve rejeitar acesso quando usuário não está autenticado', async () => {
      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe('Token não fornecido');
    });

    it('deve rejeitar acesso quando permissão não existe no sistema', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');    
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const adminRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'admin'),
      });

      if (adminRole) {
        await UserRoleFactory.attachRoleToUser(user.id, adminRole.id);
      }

      const response = await request(server)
        .get('/api/v1/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);
    });

    it('deve rejeitar acesso quando usuário não existe', async () => {
      const nonExistentUserId = faker.number.int({ min: 99999, max: 999999 });
      const token = UserFactory.generateJwtToken(nonExistentUserId);

      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      expect(response.body.message).toBe('Usuário não encontrado');
    });
  });

  describe('hasAllPermissions', () => {
    it('deve permitir acesso quando usuário tem todas as permissões necessárias', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const adminRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'admin'),
      });

      if (adminRole) {
        await UserRoleFactory.attachRoleToUser(user.id, adminRole.id);
      }

      const response = await request(server)
        .get('/api/v1/roles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
    });

    it('deve rejeitar acesso quando usuário não tem todas as permissões necessárias', async () => {
      const { token } = await UserFactory.createUserAndGetToken();

      const response = await request(server)
        .get('/api/v1/roles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });

    it('deve rejeitar acesso com usuário que tem permissões parciais', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const userRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'user'),
      });

      if (userRole) {
        await UserRoleFactory.attachRoleToUser(user.id, userRole.id);
      }

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: faker.hacker.noun(),
          description: faker.lorem.sentence(),
          action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
        });

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('hasAnyPermission', () => {
    it('deve permitir acesso quando usuário tem pelo menos uma das permissões necessárias', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const adminRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'admin'),
      });

      if (adminRole) {
        await UserRoleFactory.attachRoleToUser(user.id, adminRole.id);
      }

      const response = await request(server)
        .get('/api/v1/roles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
    });

    it('deve rejeitar acesso quando usuário não tem nenhuma das permissões necessárias', async () => {
      const { token } = await UserFactory.createUserAndGetToken();

      const response = await request(server)
        .get('/api/v1/roles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });

    it('deve permitir acesso com role que tem permissão específica', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const userRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'user'),
      });

      if (userRole) {
        await UserRoleFactory.attachRoleToUser(user.id, userRole.id);
      }

      const response = await request(server)
        .get('/api/v1/roles/all')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCode.OK);
    });

    it('deve rejeitar acesso com role sem permissões necessárias', async () => {
      const { user, token } = await UserFactory.createUserAndGetToken();
      
      const { db } = await import('@/db/db.connection');
      const { roles } = await import('@/db/schema/v1/role.schema');
      const { eq } = await import('drizzle-orm');
      
      const guestRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'guest'),
      });

      if (guestRole) {
        await UserRoleFactory.attachRoleToUser(user.id, guestRole.id);
      }

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: faker.hacker.noun(),
          description: faker.lorem.sentence(),
          action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
        });

      expect(response.status).toBe(StatusCode.FORBIDDEN);
    });
  });

  describe('Cenários de erro', () => {
    it('deve rejeitar acesso com token inválido', async () => {
      const invalidToken = faker.string.alphanumeric(32);
      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve rejeitar acesso sem token', async () => {
      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve rejeitar acesso com token malformado', async () => {
      const malformedToken = faker.string.alphanumeric(10);
      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${malformedToken}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('deve rejeitar acesso com token expirado', async () => {
      const expiredToken = faker.string.alphanumeric(64);
      const mockPermissionData = {
        name: faker.hacker.noun(),
        description: faker.lorem.sentence(),
        action: faker.helpers.arrayElement(['read', 'create', 'update', 'delete']),
      };

      const response = await request(server)
        .post(route)
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(mockPermissionData);

      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });
  });
});
