import winston from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, printf, colorize } = winston.format;

class Logger {
  private logger: winston.Logger;
  private logsDir: string;

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor() {
    const logFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });

    this.logsDir = path.join(process.cwd(), 'logs');
    const currentDate = this.getCurrentDate();

    this.logger = winston.createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        logFormat
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${this.logsDir}/${currentDate}/error.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `${this.logsDir}/${currentDate}/combined.log`,
        }),
      ],
    });
  }

  getLogFiles(): { date: string; files: string[] }[] {
    if (!fs.existsSync(this.logsDir)) {
      return [];
    }

    return fs
      .readdirSync(this.logsDir)
      .filter((date) =>
        fs.statSync(path.join(this.logsDir, date)).isDirectory()
      )
      .map((date) => ({
        date,
        files: fs.readdirSync(path.join(this.logsDir, date)),
      }));
  }

  getLogPath(date?: string, type: 'error' | 'combined' = 'combined'): string {
    const logDate = date || this.getCurrentDate();
    return path.join(this.logsDir, logDate, `${type}.log`);
  }

  private formatServerBanner(): string {
    return [
      '=======================================================',
      '                    STARTER API                        ',
      '=======================================================',
    ].join('\n');
  }

  private formatServerInfo(env: string, port: number): string {
    const timestamp = new Date().toLocaleString('pt-BR');
    return [
      '🚀 Servidor iniciado com sucesso!',
      `⏱️  Iniciado em: ${timestamp}`,
      `🔧 Ambiente: ${env.toUpperCase()}`,
      `📡 Porta: ${port}`,
      `🌐 URL: http://localhost:${port}`,
      '=======================================================',
    ].join('\n');
  }

  serverStartup(env: string, port: number): void {
    this.logger.info(this.formatServerBanner());
    this.logger.info(this.formatServerInfo(env, port));
  }

  error(message: string, error?: unknown): void {
    this.logger.error(`❌ ${message}`, error);
  }

  info(message: string): void {
    this.logger.info(`ℹ️ ${message}`);
  }

  warn(message: string): void {
    this.logger.warn(`⚠️ ${message}`);
  }

  debug(message: string): void {
    this.logger.debug(`🔍 ${message}`);
  }
}

export const logger = new Logger();
