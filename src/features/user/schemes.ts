/* eslint-disable prettier/prettier */
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
});

export const updateUserSchema = createUserSchema.partial();
