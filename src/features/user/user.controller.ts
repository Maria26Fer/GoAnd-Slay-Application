import { Request, Response } from "express";
import { createUserSchema } from "./schemes";
import { randomUUID } from "crypto";

type UserProps = {
  id: string;
  name: string;
  email: string;
  age: number;
};

const users: Array<UserProps> = [];

export const getUsers = (req: Request, res: Response) => {
  return res.status(200).send({ data: users });
};

export const getUserById = (req: Request, res: Response) => {
  return res.status(201).send({});
};

export const createUser = (req: Request, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);

    const invalidEmail = users?.find((user) => user.email === data?.email);

    if (invalidEmail) return res.status(401).send({ error: "Invalid e-mail!" });

    const id = randomUUID(); // Gera um id aleatorio

    users.push({
      ...data,
      id,
    });

    return res.status(201).send({ data: { id } });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

export const updateUser = (req: Request, res: Response) => {
  return res.status(201).send({});
};

export const deleteUser = (req: Request, res: Response) => {
  return res.status(201).send({});
};
