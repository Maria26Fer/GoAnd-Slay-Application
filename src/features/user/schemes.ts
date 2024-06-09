import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(), //seguir modelo de um objeto
  email: z.string().email(),
  age: z.number().int().positive(),
});
