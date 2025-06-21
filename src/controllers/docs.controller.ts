import { Request, Response } from 'express';

// All placeholder handlers for now

export const getAllDocs = async (req: Request, res: Response) => {
  res.send('Get all documents - placeholder');
};

export const createDoc = async (req: Request, res: Response) => {
  res.send('Create new document - placeholder');
};

export const getDocById = async (req: Request, res: Response) => {
  res.send(`Get document with ID ${req.params.id} - placeholder`);
};

export const updateDoc = async (req: Request, res: Response) => {
  res.send(`Update document with ID ${req.params.id} - placeholder`);
};

export const deleteDoc = async (req: Request, res: Response) => {
  res.send(`Delete document with ID ${req.params.id} - placeholder`);
};
