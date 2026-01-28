import { Request, Response } from "express";
import { TodoService } from "./service.todo.js";
import { CreateTodoDTO } from "./dto.todo.js";

export class TodoController {
  private service = new TodoService();

  getAll = async (_req: Request, res: Response) => {
    const todos = await this.service.getAll();
    res.json(todos);
  };

  create = async (req: Request, res: Response) => {
    const dto: CreateTodoDTO = req.body;
    const todo = await this.service.create(dto);
    res.status(201).json(todo);
  };
}
