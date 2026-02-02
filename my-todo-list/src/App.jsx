import { useEffect, useMemo, useState } from "react";
import "./index.css";

const getSavedTasks = () => {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch {
    return [];
  }
};

export default function App() {
  const [tasks, setTasks] = useState(getSavedTasks);
  const [text, setText] = useState("");

  // Save to localStorage whenever tasks changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    return { total, done, pending: total - done };
  }, [tasks]);

  const addTask = () => {
    if (text.trim() === "") return;
    const value = text.trim();

  const newTask = {
      id: crypto.randomUUID(),
      text: value,
      done: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setText("");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const clearAll = () => setTasks([]);
  const clearDone = () => setTasks((prev) => prev.filter((t) => !t.done));

  const onEnter = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Todo List</h1>

        <div className="inputRow">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Add a task..."
            className="input"
          />
          <button onClick={addTask} className="btn btnPrimary">
            Add
          </button>
        </div>

        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Done: {stats.done}</span>
          <span>Pending: {stats.pending}</span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task ✨</p>
        ) : (
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.id} className="item">
                <label className="left">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleDone(task.id)}
                  />
                  <span className={task.done ? "text done" : "text"}>
                    {task.text}
                  </span>
                </label>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btnDanger"
                  aria-label="Remove task"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="actions">
          <button onClick={clearDone} className="btn">
            Clear Done
          </button>
          <button onClick={clearAll} className="btn btnDangerOutline">
            Clear All
          </button>
        </div>
      </div>

      <p className="footer">
        Saved in <b>localStorage</b> ✅ Refresh page — tasks stay.
      </p>
    </div>
  );
}
