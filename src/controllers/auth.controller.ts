import { Request, Response } from 'express';

export const signup = (_req: Request, res: Response) => {
  res.send('Signup placeholder');
};

export const login = (_req: Request, res: Response) => {
  res.send('Login placeholder');
};

export const resetPassword = (_req: Request, res: Response) => {
  res.send('Reset Password placeholder');
};
