'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------

  // Stores all todos
  const [todos, setTodos] = useState<any[]>([]);

  // Stores the value entered in the input
  const [newTodo, setNewTodo] = useState<any>('');

  // Shows loading message
  const [loading, setLoading] = useState<any>(false);

  // Stores error message
  const [error, setError] = useState<any>('');

  // -------------------------------------------------------
  // GET TODOS
  // -------------------------------------------------------

  const getTodos = async (): Promise<any> => {
    try {
      setLoading(true);
      setError('');

      // Send GET request to our API
      const response: any = await axios.get('/api');

      // Axios automatically converts JSON into JavaScript
      setTodos(response.data);
    } catch (error: any) {
      console.log(error);
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // ADD TODO
  // -------------------------------------------------------

  const addTodo = async (event: any): Promise<any> => {
    // Prevent page refresh
    event.preventDefault();

    // Don't add an empty todo
    if (!newTodo.trim()) {
      return;
    }

    try {
      setError('');

      // Send POST request
      const response: any = await axios.post('/api', {
        title: newTodo,
      });

      // Add the new todo to the existing list
      setTodos((currentTodos: any[]) => [response.data, ...currentTodos]);

      // Clear input
      setNewTodo('');
    } catch (error: any) {
      console.log(error);
      setError('Failed to add todo.');
    }
  };

  // -------------------------------------------------------
  // UPDATE TODO
  // -------------------------------------------------------

  const toggleTodo = async (todo: any): Promise<any> => {
    try {
      setError('');

      // Send PATCH request
      // ID is passed as a query parameter
      // /api?id=1

      const response: any = await axios.patch(`/api?id=${todo.id}`, {
        completed: !todo.completed,
      });

      // Update the todo in our local state
      setTodos((currentTodos: any[]) =>
        currentTodos.map((item: any) =>
          item.id === todo.id ? response.data : item
        )
      );
    } catch (error: any) {
      console.log(error);
      setError('Failed to update todo.');
    }
  };

  // -------------------------------------------------------
  // DELETE TODO
  // -------------------------------------------------------

  const deleteTodo = async (id: any): Promise<any> => {
    try {
      setError('');

      // Send DELETE request
      // /api?id=1

      await axios.delete(`/api?id=${id}`);

      // Remove the todo from local state
      setTodos((currentTodos: any[]) =>
        currentTodos.filter((todo: any) => todo.id !== id)
      );
    } catch (error: any) {
      console.log(error);
      setError('Failed to delete todo.');
    }
  };

  // -------------------------------------------------------
  // LOAD TODOS WHEN PAGE OPENS
  // -------------------------------------------------------

  useEffect(() => {
    getTodos();
  }, []);

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Page title */}
        <h1 className="mb-6 text-3xl font-bold">Todo App</h1>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6 flex gap-2">
          {/* Input */}
          <input
            type="text"
            value={newTodo}
            onChange={(event: any) => setNewTodo(event.target.value)}
            placeholder="Enter a todo..."
            className="flex-1 rounded border bg-white px-4 py-2"
          />

          {/* Add button */}
          <button
            type="submit"
            className="rounded bg-black px-5 py-2 text-white"
          >
            Add
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

        {/* Loading */}
        {loading && <p className="mb-4 text-gray-500">Loading...</p>}

        {/* Todo List */}
        <div className="space-y-3">
          {todos.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center justify-between rounded border bg-white p-4"
            >
              {/* Checkbox + Todo title */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                <span
                  className={todo.completed ? 'text-gray-400 line-through' : ''}
                >
                  {todo.title}
                </span>
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          ))}

          {/* No todos */}
          {!loading && todos.length === 0 && (
            <p className="py-8 text-center text-gray-500">No todos found.</p>
          )}
        </div>
      </div>
    </main>
  );
}