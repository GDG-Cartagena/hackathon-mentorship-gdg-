import { useEffect, useState } from "react";
import type { Todo } from "./interfaces/todo.interface";
import { getTodos, createTodo } from "./apis/todo";
import { TodoList } from "./components/todoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      const newTodo = await createTodo(title);
      setTodos((prev) => [...prev, newTodo]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    /* Contenedor principal: Centra vertical y horizontalmente */
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-8 ">

      {/* Tarjeta de la App: Responsive y centrada horizontalmente por el flex padre */}
      <div className="bg-white w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl">

        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800">
          📝 Todo App
        </h1>

        <div className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué hay que hacer?"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          />
          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            Agregar Tarea
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <p className="animate-pulse text-gray-400 font-medium">Cargando tareas...</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <TodoList todos={todos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

