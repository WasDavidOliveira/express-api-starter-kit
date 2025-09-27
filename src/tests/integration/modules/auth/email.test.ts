import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '@/server';
import { StatusCode } from '@/constants/http';
import { UserFactory } from '@/tests/factories/auth/user.factory';
import { Server } from 'http';
import setupTestDB from '@/tests/hooks/setup-db';
import { emitAppEvent } from '@/events';

vi.mock('@/events', () => ({
  emitAppEvent: vi.fn(),
  onAppEvent: vi.fn(),
}));

vi.mock('@/services/notification/email/email.service', () => ({
  EmailService: vi.fn().mockImplementation(() => ({
    isEnabled: vi.fn().mockReturnValue(true),
    sendWelcomeEmail: vi.fn().mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
    }),
  })),
}));

vi.mock('@/services/notification/email/email-event.service', () => ({
  EmailEventService: {
    initialize: vi.fn(),
  },
}));

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

const apiUrl: string = '/api/v1/auth';

describe('Envio de Email de Boas-vindas', () => {
  setupTestDB();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve enviar email de boas-vindas ao registrar usuário', async () => {
    const userData = UserFactory.build().make();

    const response = await request(server)
      .post(`${apiUrl}/register`)
      .send(userData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário criado com sucesso.');
    
    expect(vi.mocked(emitAppEvent)).toHaveBeenCalledWith('welcome', {
      type: 'welcome',
      timestamp: expect.any(Date),
      data: {
        email: userData.email,
        name: userData.name,
      },
    });
  });

  it('deve emitir evento mesmo se o serviço estiver desabilitado', async () => {
    const userData = UserFactory.build().make();

    const response = await request(server)
      .post(`${apiUrl}/register`)
      .send(userData);

    expect(response.status).toBe(StatusCode.OK);
    
    expect(vi.mocked(emitAppEvent)).toHaveBeenCalledWith('welcome', {
      type: 'welcome',
      timestamp: expect.any(Date),
      data: {
        email: userData.email,
        name: userData.name,
      },
    });
  });

  it('deve emitir evento mesmo com erro no sistema', async () => {
    const userData = UserFactory.build().make();

    const response = await request(server)
      .post(`${apiUrl}/register`)
      .send(userData);

    expect(response.status).toBe(StatusCode.OK);
    expect(response.body.message).toBe('Usuário criado com sucesso.');
    
    expect(vi.mocked(emitAppEvent)).toHaveBeenCalledWith('welcome', {
      type: 'welcome',
      timestamp: expect.any(Date),
      data: {
        email: userData.email,
        name: userData.name,
      },
    });
  });
});
