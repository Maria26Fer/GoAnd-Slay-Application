import { z } from "zod";

export const USER_NOT_FOUND = "User not found!";
export const EMAIL_IS_NOT_VALID = "Email is not valid!";
export const INVALID_FIELDS = "Invalid Fields!";
export const INVALID_ID = "Invalid ID!";

export const formatError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error?.issues?.[0]?.message;
  }
  return error;
};
