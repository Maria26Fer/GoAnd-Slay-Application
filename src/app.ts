import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user.routes";

const port = process.env.SERVER_PORT || 4000;
const app = express();

app.use(express.json());
app.use(userRoutes);

app.listen(port, () =>
  console.info(`Running Server in http://localhost:${port}`)
);
