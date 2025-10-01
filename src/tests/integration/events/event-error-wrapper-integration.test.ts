import { describe, it, expect, beforeEach } from 'vitest';
import { EventErrorWrapper } from '@/events/core/event-error-wrapper';
import { AppEvent } from '@/types/core/events.types';
import setupTestDB from '@/tests/hooks/setup-db';
import { db } from '@/db/db.connection';
import { errorLogs } from '@/db/schema/v1/error-log.schema';

describe('EventErrorWrapper - Integração', () => {
  setupTestDB();

  let eventErrorWrapper: EventErrorWrapper;

  beforeEach(() => {
    eventErrorWrapper = new EventErrorWrapper();
  });

  describe('Integração com banco de dados', () => {
    it('deve persistir log de erro no banco quando handler falha', async () => {
      const testError = new Error('Erro de integração');
      const mockHandler = async (): Promise<void> => {
        throw testError;
      };

      const mockEvent: AppEvent = {
        type: 'notification',
        timestamp: new Date(),
        data: {
          title: 'Teste de integração',
          description: 'Testando persistência',
          level: 'error',
        },
      };

      await eventErrorWrapper.wrapEventHandler(
        'integration-event',
        'integration-service',
        mockHandler,
        mockEvent,
      );

      const errorLogsInDb = await db.select().from(errorLogs);
      const savedErrorLog = errorLogsInDb.find(
        log => log.eventType === 'integration-event',
      );

      expect(savedErrorLog).toBeDefined();
      expect(savedErrorLog?.serviceName).toBe('integration-service');
      expect(savedErrorLog?.errorMessage).toBe('Erro de integração');
      expect(savedErrorLog?.errorStack).toContain('Error: Erro de integração');
      expect(savedErrorLog?.eventData).toMatchObject({
        type: mockEvent.type,
        data: mockEvent.data,
        timestamp: expect.any(String),
      });
      expect(savedErrorLog?.metadata).toHaveProperty('timestamp');
      expect(savedErrorLog?.metadata).toHaveProperty('errorType', 'Error');
    });

    it('deve salvar múltiplos logs de erro independentemente', async () => {
      const handlers = [
        async (): Promise<void> => {
          throw new Error('Primeiro erro');
        },
        async (): Promise<void> => {
          throw new Error('Segundo erro');
        },
        async (): Promise<void> => {
          throw new Error('Terceiro erro');
        },
      ];

      const events: AppEvent[] = [
        {
          type: 'notification',
          timestamp: new Date(),
          data: { title: 'Evento 1', description: 'Desc 1', level: 'error' },
        },
        {
          type: 'welcome',
          timestamp: new Date(),
          data: { email: 'test1@example.com', name: 'User 1' },
        },
        {
          type: 'error',
          timestamp: new Date(),
          data: {
            error: new Error('Original error'),
            method: 'GET',
            url: '/test',
            environment: 'test',
          },
        },
      ];

      for (let i = 0; i < handlers.length; i++) {
        await eventErrorWrapper.wrapEventHandler(
          `multi-event-${i + 1}`,
          `multi-service-${i + 1}`,
          handlers[i],
          events[i],
        );
      }

      const errorLogsInDb = await db.select().from(errorLogs);
      const multiEventLogs = errorLogsInDb.filter(log =>
        log.eventType.startsWith('multi-event-'),
      );

      expect(multiEventLogs).toHaveLength(3);

      const sortedLogs = multiEventLogs.sort((a, b) =>
        a.eventType.localeCompare(b.eventType),
      );

      expect(sortedLogs[0].errorMessage).toBe('Primeiro erro');
      expect(sortedLogs[1].errorMessage).toBe('Segundo erro');
      expect(sortedLogs[2].errorMessage).toBe('Terceiro erro');
    });

    it('deve lidar com dados de evento complexos', async () => {
      const complexEvent: AppEvent = {
        type: 'notification',
        timestamp: new Date(),
        data: {
          title: 'Evento complexo',
          description: 'Evento com dados aninhados',
          level: 'warning',
          color: 16711680,
          stack: 'stack trace complexo\ncom múltiplas linhas',
          metadata: {
            nested: {
              value: 'valor aninhado',
              array: [1, 2, 3],
              boolean: true,
            },
          },
        },
      };

      const complexError = new RangeError('Erro de range complexo');
      const mockHandler = async (): Promise<void> => {
        throw complexError;
      };

      await eventErrorWrapper.wrapEventHandler(
        'complex-data-event',
        'complex-data-service',
        mockHandler,
        complexEvent,
      );

      const errorLogsInDb = await db.select().from(errorLogs);
      const complexLog = errorLogsInDb.find(
        log => log.eventType === 'complex-data-event',
      );

      expect(complexLog).toBeDefined();
      expect(complexLog?.eventData).toMatchObject({
        type: complexEvent.type,
        data: complexEvent.data,
        timestamp: expect.any(String),
      });
      expect(complexLog?.metadata).toHaveProperty('errorType', 'RangeError');

      const savedData = complexLog?.eventData as AppEvent;
      const savedDataRecord = savedData.data as Record<string, unknown>;
      const metadata = savedDataRecord.metadata as {
        nested: { array: number[] };
      };
      expect(metadata).toBeDefined();
      expect(metadata.nested.array).toEqual([1, 2, 3]);
    });

    it('não deve criar log quando handler executa com sucesso', async () => {
      const successHandler = async (_event: AppEvent): Promise<void> => {
        return Promise.resolve();
      };

      const mockEvent: AppEvent = {
        type: 'notification',
        timestamp: new Date(),
        data: {
          title: 'Sucesso',
          description: 'Handler bem-sucedido',
          level: 'success',
        },
      };

      const logsBeforeTest = await db.select().from(errorLogs);

      await eventErrorWrapper.wrapEventHandler(
        'success-event',
        'success-service',
        successHandler,
        mockEvent,
      );

      const logsAfterTest = await db.select().from(errorLogs);

      expect(logsAfterTest).toHaveLength(logsBeforeTest.length);

      const successEventLogs = logsAfterTest.filter(
        log => log.eventType === 'success-event',
      );
      expect(successEventLogs).toHaveLength(0);
    });
  });
});
