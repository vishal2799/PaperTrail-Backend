import crypto from "crypto";
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import jwt, {Secret, SignOptions} from "jsonwebtoken";
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CustomError } from '../utils/CustomError';
import { sendEmail } from "../utils/sendEmail";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      throw new CustomError("User already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      throw new CustomError("Invalid credentials", 401);
    }

    const user = userResult[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

const payload = {
  id: user.id,
  email: user.email,
};
    // Sign JWT
    const token = jwt.sign(
  payload,
  process.env.JWT_SECRET as Secret,
  {
    expiresIn: (process.env.JWT_EXPIRES_IN as string) || "7d",
  } as SignOptions
);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};


export const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new CustomError("Token and new password are required", 400);
    }

    // Find user with token
const userResult = await db.select().from(users).where(eq(users.resetToken, token));
if (userResult.length === 0) {
  throw new CustomError("Invalid or expired token", 400);
}
const user = userResult[0];

// ✅ Proper null-safe check
if (!user.resetTokenExpires || new Date() > user.resetTokenExpires) {
  throw new CustomError("Reset token expired", 400);
}

// Hash new password + update
const hashed = await bcrypt.hash(newPassword, 10);

await db.update(users)
  .set({
    password: hashed,
    resetToken: null,
    resetTokenExpires: null,
  })
  .where(eq(users.id, user.id));

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    next(err);
  }
};


export const forgotPassword = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      throw new CustomError("No user found with that email", 404);
    }
    const user = userResult[0];

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to DB
    await db.update(users)
      .set({ resetToken, resetTokenExpires: expires })
      .where(eq(users.id, user.id));

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email content
    const message = `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
      <p>This link expires in 1 hour.</p>
    `;

    // Send email
    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (err) {
    next(err);
  }
};