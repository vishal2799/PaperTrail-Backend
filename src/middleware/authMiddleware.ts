import { Request, Response, NextFunction } from 'express';

// TEMP: placeholder middleware, always allows
export const protect = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify JWT from headers in real version
  console.log('✅ Auth check (placeholder)');
  next();
};
