import { eventEmitter } from './event-emitter';
import { NotificationEvent, ErrorEvent } from '@/types/core/events.types';

export const sendSuccessNotification = (message: string): void => {
  const event: NotificationEvent = {
    type: 'notification',
    timestamp: new Date(),
    data: {
      title: 'Sucesso',
      description: message,
      level: 'success',
    },
  };

  eventEmitter.emit('notification', event);
};

export const sendWarningNotification = (message: string): void => {
  const event: NotificationEvent = {
    type: 'notification',
    timestamp: new Date(),
    data: {
      title: 'Aviso',
      description: message,
      level: 'warning',
    },
  };

  eventEmitter.emit('notification', event);
};

export const sendInfoNotification = (message: string): void => {
  const event: NotificationEvent = {
    type: 'notification',
    timestamp: new Date(),
    data: {
      title: 'Informação',
      description: message,
      level: 'info',
    },
  };

  eventEmitter.emit('notification', event);
};

export const sendErrorNotification = (error: Error | string): void => {
  const isError = error instanceof Error;

  const event: NotificationEvent = {
    type: 'notification',
    timestamp: new Date(),
    data: {
      title: 'Erro',
      description: isError ? error.message : error,
      level: 'error',
      stack: isError ? error.stack : undefined,
    },
  };

  eventEmitter.emit('notification', event);
};

export const sendCustomNotification = (
  title: string,
  description: string,
  color?: number,
): void => {
  const event: NotificationEvent = {
    type: 'notification',
    timestamp: new Date(),
    data: {
      title,
      description,
      level: 'info',
      color,
    },
  };

  eventEmitter.emit('notification', event);
};

export const emitErrorEvent = (
  error: Error,
  method: string,
  url: string,
  environment: string,
  userAgent?: string,
  ip?: string,
): void => {
  const errorEvent: ErrorEvent = {
    type: 'error',
    timestamp: new Date(),
    data: {
      error,
      method,
      url,
      environment,
      userAgent,
      ip,
    },
  };

  eventEmitter.emit('error', errorEvent);
};
