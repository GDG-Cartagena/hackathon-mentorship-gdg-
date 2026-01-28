import type { Todo } from "../interfaces/todo.interface";

interface Props {
  todos: Todo[];
}

export function TodoList({ todos }: Props) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay tareas aún 👀
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
        >
          <span
            className={
              todo.completed
                ? "line-through text-gray-400"
                : "text-gray-800"
            }
          >
            {todo.title}
          </span>

          {todo.completed && <span>✅</span>}
        </li>
      ))}
    </ul>
  );
}
