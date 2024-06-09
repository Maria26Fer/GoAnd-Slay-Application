import express, { Request, Response } from "express";
import "dotenv/config";

const app = express();

const port = process.env.SERVER_PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express <3");
});

app.listen(port, () => console.log(`Running Server in localhost:${port}`));
