import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Not authorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // attach payload to request
    next();
  } catch (error) {
    throw new CustomError("Not authorized: Invalid token", 401);
  }
};
