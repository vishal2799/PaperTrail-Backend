import { Request, Response } from 'express';
import { CustomError } from '../utils/CustomError';
import { db } from '../db';
import { documents } from '../db/schema';
import { eq } from 'drizzle-orm';

// All placeholder handlers for now

export const getAllDocs = async (req: Request, res: Response) => {
  const user = req.user;
    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, user.id));

    res.json({ success: true, documents: docs });
};

export const createDoc = async (req: Request, res: Response) => {
   const { title, content, expiryDate } = req.body;
  const user = req.user;

  if (!user || typeof user === "string") {
    throw new CustomError("Unauthorized", 401);
  }

  if (!title || !expiryDate) {
    throw new CustomError("Title and expiryDate are required", 400);
  }

  const [doc] = await db
    .insert(documents)
    .values({
      title,
      content: content || "",
      expiryDate: new Date(expiryDate),
      userId: user.id,
    })
    .returning();

  res.status(201).json({ success: true, document: doc });
};

export const getDocById = async (req: Request, res: Response) => {
  const { id } = req.params;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, Number(id)));

    if (!doc || doc.userId !== user.id) {
      throw new CustomError("Document not found", 404);
    }

    res.json({ success: true, document: doc });
};

export const updateDoc = async (req: Request, res: Response) => {
  const { id } = req.params;
    const { title, content, expiryDate } = req.body;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const [existing] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, Number(id)));

    if (!existing || existing.userId !== user.id) {
      throw new CustomError("Document not found", 404);
    }

    const [updated] = await db
      .update(documents)
      .set({
        title: title || existing.title,
        content: content ?? existing.content,
        expiryDate: expiryDate ? new Date(expiryDate) : existing.expiryDate,
      })
      .where(eq(documents.id, Number(id)))
      .returning();

    res.json({ success: true, document: updated });
};

export const deleteDoc = async (req: Request, res: Response) => {
   const { id } = req.params;
    const user = req.user;

    if (!user || typeof user === "string") {
      throw new CustomError("Unauthorized", 401);
    }

    const [existing] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, Number(id)));

    if (!existing || existing.userId !== user.id) {
      throw new CustomError("Document not found", 404);
    }

    await db.delete(documents).where(eq(documents.id, Number(id)));

    res.json({ success: true, message: "Document deleted" });
};
