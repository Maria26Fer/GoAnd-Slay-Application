import { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "./schemes";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  EMAIL_IS_NOT_VALID,
  formatError,
  INVALID_FIELDS,
  INVALID_ID,
  USER_NOT_FOUND,
} from "src/common/errors";

type UserProps = {
  id: string;
  name: string;
  email: string;
  age: number;
};

const users: Array<UserProps> = [];

const uuidSchema = z.string().uuid(); // Definindo um schema para validação de um uuid;

const checkUniqueEmail = (email: string, id?: string) => {
  const findUser = users.find((user) => user.email === email); // Verifica se tem um usuario com esse email

  if (findUser) {
    // se encontrar um usuario
    if (findUser?.id === id) {
      // verifica se é o mesmo id do usuario que esta sendo atualizado
      return true;
    } else {
      return false; // se não for, então o email não é unico
    }
  }
  return true;
};

export const getUsers = (req: Request, res: Response) => {
  return res.status(200).json({ data: users });
};

export const getUserById = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const { success, data } = uuidSchema.safeParse(userId); // Faz a validação do id conforme foi definido no schema;

    if (!success) {
      return res.status(400).json({ error: INVALID_ID });
    }

    const user = users.find((user) => user.id === data);

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ error: USER_NOT_FOUND });
    }
  } catch (error) {
    res.status(400).send({
      error: formatError(error),
    });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const data = createUserSchema.strict(INVALID_FIELDS).parse(req.body); // Valida os campos recebidos do body

    const uniqueEmail = checkUniqueEmail(data.email);

    if (!uniqueEmail)
      return res.status(400).send({ error: EMAIL_IS_NOT_VALID });

    const id = randomUUID(); // Irá gerar um id aleatorio;

    const newUser = {
      ...data,
      id,
    };

    users.push(newUser);

    return res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(400).send({
      error: formatError(error),
    });
  }
};

export const updateUser = (req: Request, res: Response) => {
  try {
    const data = updateUserSchema.strict(INVALID_FIELDS).parse(req.body); // Validando os dados de entrada;

    const userId = req.params.id;

    const existingUser = users.find((user) => user.id === userId);

    if (!existingUser) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    if (data.email) {
      const uniqueEmail = checkUniqueEmail(data.email, userId);
      if (!uniqueEmail)
        return res.status(400).send({ error: EMAIL_IS_NOT_VALID });
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
      // Irá atualizar os usuarios na lista de users substituindo os dados novos;
      ...users[updateUserIndex],
      ...data,
    };

    return res.status(200).json({ data: users[updateUserIndex] });
  } catch (error) {
    res.status(400).send({
      error: formatError(error),
    });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    /*
    Vai buscar o usuário pelo Id, se encontrar ele irá ser removido, 
    se não irá emitir uma mensagem de erro;
    */
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    users.splice(userIndex, 1); // Remove o usuário do array;

    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).send({
      error: formatError(error),
    });
  }
};
