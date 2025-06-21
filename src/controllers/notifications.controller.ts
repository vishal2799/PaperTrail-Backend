import { Request, Response } from 'express';

// All placeholder handlers for now

export const getAllNotifications = async (req: Request, res: Response) => {
  res.send('Get all notifications - placeholder');
};

export const createNotification = async (req: Request, res: Response) => {
  res.send('Create new notification - placeholder');
};

export const getNotificationById = async (req: Request, res: Response) => {
  res.send(`Get notification with ID ${req.params.id} - placeholder`);
};

export const deleteNotification = async (req: Request, res: Response) => {
  res.send(`Delete notification with ID ${req.params.id} - placeholder`);
};
