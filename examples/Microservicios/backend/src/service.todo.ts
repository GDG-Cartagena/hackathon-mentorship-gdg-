import { TodoDAO } from "./database/dao.todo.js";
import { CreateTodoDTO } from "./dto.todo.js";
import { Todo } from "./interfaces/createtodo.interface.js";

export class TodoService {
  private dao = new TodoDAO();

  async getAll(): Promise<Todo[]> {
    return this.dao.findAll();
  }

  async create(dto: CreateTodoDTO): Promise<Todo> {
    return this.dao.create(dto);
  }
}
