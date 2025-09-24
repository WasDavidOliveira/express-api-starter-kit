import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import setupTestDB from '@/tests/hooks/setup-db';
import { faker } from '@faker-js/faker';
import {
  createRequestContextMiddleware,
  requestContextMiddleware,
} from '@/middlewares/core/request-context.middleware';
import {
  getRequestContext,
  getRequestId,
  getUserId,
} from '@/utils/core/request-context.utils';

describe('Request Context Middleware', () => {
  setupTestDB();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (): Partial<Request> => {
    const method = faker.helpers.arrayElement(['GET', 'POST', 'PUT']);
    const path = `/api/v1/${faker.word.sample()}/${faker.number.int({ min: 1, max: 999 })}`;
    const queryKey = faker.string.alpha({ length: 1 }).toLowerCase();
    const queryVal = faker.number.int({ min: 1, max: 9 }).toString();
    const userAgent = faker.internet.userAgent();
    const ip = faker.internet.ip();
    const sessionId = `sess-${faker.string.alphanumeric({ length: 6 })}`;
    const userId = faker.number.int({ min: 1, max: 9999 });
    const url = `${path}?${queryKey}=${queryVal}`;

    return {
      method,
      originalUrl: url,
      url,
      get: vi
        .fn()
        .mockImplementation((h: string) =>
          h.toLowerCase() === 'user-agent' ? userAgent : undefined,
        ),
      headers: { 'user-agent': userAgent },
      query: { [queryKey]: queryVal },
      params: { id: faker.number.int({ min: 1, max: 999 }).toString() },
      body: { foo: faker.word.sample() },
      ip,
      socket: { remoteAddress: ip } as unknown as import('net').Socket,
      userId,
      sessionID: sessionId,
    };
  };

  const createMockResponse = () => {
    const setMock = vi.fn().mockReturnThis();
    const res: Partial<Response> = {
      set: setMock,
    };
    return res as Response;
  };

  const createNext = (): NextFunction => vi.fn();

  it('deve criar contexto e propagar X-Request-ID existente', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    const incomingReqId = faker.string.uuid();
    (req.get as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (h: string) =>
        h.toLowerCase() === 'x-request-id'
          ? incomingReqId
          : (req.headers?.['user-agent'] as string),
    );

    requestContextMiddleware(req as Request, res as Response, next);

    const ctx = getRequestContext();
    expect(ctx?.requestId).toBe(incomingReqId);
    expect(getRequestId()).toBe(incomingReqId);
    expect(res.set).toHaveBeenCalledWith('X-Request-ID', incomingReqId);
    expect(['GET', 'POST', 'PUT']).toContain(ctx?.method as string);
    expect(ctx?.url).toContain('/api/v1/');
    expect(ctx?.userAgent).toBe(req.headers?.['user-agent']);
    expect(ctx?.ip).toBeTruthy();
    expect(typeof ctx?.startTime).toBe('number');
    expect(ctx?.timestamp instanceof Date).toBe(true);
    expect(ctx?.sessionId).toBe((req as Partial<Request>).sessionID);
    expect(getUserId()).toBe((req as Partial<Request>).userId);
    expect(next).toHaveBeenCalled();
  });

  it('deve gerar novo X-Request-ID quando não enviado pelo cliente', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    (req.get as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (h: string) =>
        h.toLowerCase() === 'user-agent'
          ? (req.headers?.['user-agent'] as string)
          : undefined,
    );

    const fixedId = `generated-${faker.string.alphanumeric({ length: 8 })}`;
    const mw = createRequestContextMiddleware({
      generateRequestId: () => fixedId,
    });

    mw(req as Request, res as Response, next);

    const ctx = getRequestContext();
    expect(ctx?.requestId).toBe(fixedId);
    expect(res.set).toHaveBeenCalledWith('X-Request-ID', fixedId);
  });

  it('deve incluir userId no contexto quando habilitado', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    const mw = createRequestContextMiddleware({ includeUserInfo: true });
    mw(req as Request, res as Response, next);

    const ctx = getRequestContext();
    expect(ctx?.userId).toBe((req as Partial<Request>).userId);
  });

  it('não deve incluir userId quando desabilitado', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    const mw = createRequestContextMiddleware({ includeUserInfo: false });
    mw(req as Request, res as Response, next);

    const ctx = getRequestContext();
    expect(ctx?.userId).toBeUndefined();
  });

  it('deve incluir metadados completos quando habilitado', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createNext();

    const mw = createRequestContextMiddleware({ includeMetadata: true });
    mw(req as Request, res as Response, next);

    const ctx = getRequestContext();
    expect(ctx?.metadata).toBeTruthy();
    expect((ctx?.metadata as Record<string, unknown>).headers).toBeTruthy();
    expect((ctx?.metadata as Record<string, unknown>).query).toBeTruthy();
    expect((ctx?.metadata as Record<string, unknown>).params).toBeTruthy();
    expect((ctx?.metadata as Record<string, unknown>).body).toEqual({
      foo: (req as Partial<Request>).body?.foo,
    });
  });

  it('deve truncar body dos metadados quando exceder maxMetadataSize', () => {
    const req = createMockRequest();
    req.body = { big: faker.string.alpha({ length: 5000 }) };
    const res = createMockResponse();
    const next = createNext();

    const mw = createRequestContextMiddleware({
      includeMetadata: true,
      maxMetadataSize: 100,
    });
    mw(req as Request, res as Response, next);

    const ctx = getRequestContext();
    const metadata = ctx?.metadata as Record<string, unknown>;
    expect(metadata.body).toBe('[TRUNCATED]');
  });
});
