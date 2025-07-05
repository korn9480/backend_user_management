import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be between 2-50 characters").max(50, "Name must be between 2-50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role_id: z.number().int().positive("Role ID must be a positive integer"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be between 2-50 characters").max(50, "Name must be between 2-50 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  role_id: z.number().int().positive("Role ID must be a positive integer").optional(),
});

export const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
};