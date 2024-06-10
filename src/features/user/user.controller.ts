/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "./schemes";
import { randomUUID } from "crypto";
import { z } from "zod";

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

const uuidSchema = z.string().uuid(); // Definindo um schema para validação de um uuid;

export const getUserById = (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const idValidation = uuidSchema.safeParse(id); // Faz a validação do id conforme foi definido no schema

    if (!idValidation.success) {
      // Está verificando se foi bem sucedida
      return res.status(400).json({ error: "Invalid Id" });
    }

    const user = users.find((user) => user.id === id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);

    const invalidEmail = users?.find((user) => user.email === data?.email);

    if (invalidEmail) return res.status(401).send({ error: "Invalid e-mail!" });

    const id = randomUUID(); // Irá gerar um id aleatorio;

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

export function updateUser(req: Request, res: Response) {
  try {
    const data = updateUserSchema.parse(req.body); // Validando os dados de entrada

    const userId = req.params.id;

    const existingUser = users.find((user) => user.id === userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    /*
    Vai encontrar o index que possui o mesmo id que será atualizado, a função irá
    percorrer o array e retornar o primeiro valor que irá atenter a condição.
    */
    const updateUserIndex = users.findIndex((user) => user.id === userId);

    /*
    Após encontar o index do usuário, irá atualizar os dados antigos pelos novos
    - Cria um objeto com os novos dados;
    - Mesclando os dados antigos com os novos dados recebidos na requisção;
    - ... Faz a mesclagem dos dados;
    */
    users[updateUserIndex] = {
      // Irá atualizar os usuarios na lista de users substituindo os dados novos
      ...users[updateUserIndex],
      ...data,
    };

    return res.status(200).json({ updateUser: users[updateUserIndex] });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
}

export const deleteUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    /*
    Vai buscar o usuariário pelo Id, se encontrar ele irá ser removido, 
    se não irá emitir uma mensagem de erro;
    */
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1); // Remove o usuário do array;

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
