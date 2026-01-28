import { CreateTodoDTO } from "../dto.todo.js";
import { Todo } from "../interfaces/createtodo.interface.js";

/**
 * Un DAO (Data Access Object) es un patrón de diseño en software que se utiliza para abstraer y encapsular el acceso a datos.

👉 En pocas palabras:

Separa la lógica de negocio de la lógica de persistencia.

Proporciona métodos para interactuar con la base de datos (consultas, inserciones, actualizaciones, eliminaciones).

Facilita el mantenimiento y la reutilización del código, ya que el acceso a datos está centralizado en un objeto especializado.
 */

export class TodoDAO {
  private todos: Todo[] = [
    {
      id: "1",
      title: "Configurar monolito (backend + frontend)",
      completed: true,
    },
    {
      id: "2",
      title: "Crear módulo Todo con arquitectura limpia",
      completed: true,
    },
    {
      id: "3",
      title: "Conectar Vite + React con API",
      completed: false,
    },
    {
      id: "4",
      title: "Preparar deploy y variables de entorno",
      completed: false,
    },
  ];

  async findAll(): Promise<Todo[]> {
    return this.todos;
  }

  async create(dto: CreateTodoDTO): Promise<Todo> {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: dto.title,
      completed: false,
    };

    this.todos.push(todo);
    return todo;
  }
}
