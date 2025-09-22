declare global {
  namespace Express {
    interface Request {
      userId?: number;
      sessionID?: string;
    }
  }
}

export {};
