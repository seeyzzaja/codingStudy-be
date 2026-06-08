declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: {
        id: number;
        role?: string;
      };
    }
  }
}

export {};
