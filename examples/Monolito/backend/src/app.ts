import express from "express";
import todoRoutes from "./modules/todo/routes.todo.js";
import cors from "cors";
export const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/todos", todoRoutes);
