declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      file?: {
        filename: string;
      };
      user?: {
        id: number;
        role?: string;
      };
    }
  }
}

export {};
