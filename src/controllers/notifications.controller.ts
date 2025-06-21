import { Request, Response } from 'express';
import { CustomError } from '../utils/CustomError';
import { db } from '../db';
import { documents, notifications } from '../db/schema';
import { eq } from 'drizzle-orm';

// All placeholder handlers for now

export const getAllNotifications = async (req: Request, res: Response) => {
  const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const all = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id));

    res.json({ success: true, notifications: all });
};

export const createNotification = async (req: Request, res: Response) => {
  // ✅ Create new notification (usually system-triggered)
    const { docId, message } = req.body;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    if (!docId || !message) {
      throw new CustomError("docId and message are required", 400);
    }

    // ✅ Check: does document exist and belong to user?
  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, Number(docId)));

  if (!doc || doc.userId !== user.id) {
    throw new CustomError("Document not found or unauthorized", 404);
  }

    const [notification] = await db
      .insert(notifications)
      .values({
        docId,
        message,
        userId: user.id,
      })
      .returning();

    res.status(201).json({ success: true, notification });
};

export const getNotificationById = async (req: Request, res: Response) => {
  const { id } = req.params;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const [notif] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, Number(id)));

    if (!notif || notif.userId !== user.id) {
      throw new CustomError("Notification not found", 404);
    }

    res.json({ success: true, notification: notif });
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const [notif] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, Number(id)));

    if (!notif || notif.userId !== user.id) {
      throw new CustomError("Notification not found", 404);
    }

    await db.delete(notifications).where(eq(notifications.id, Number(id)));

    res.json({ success: true, message: "Notification deleted" });
};
