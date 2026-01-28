import type { Todo } from "../interfaces/todo.interface";

const API_URL = "http://localhost:3000/api/todos";

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error fetching todos");
  return res.json();
};

export const createTodo = async (title: string): Promise<Todo> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      completed: false,
    }),
  });

  if (!res.ok) throw new Error("Error creating todo");
  return res.json();
};
