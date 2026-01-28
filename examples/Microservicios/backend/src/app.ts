import express from "express";
import todoRoutes from "./routes.todo.js";

export const app = express();

app.use(express.json());
app.use("/api/todos", todoRoutes);
