"use client";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import TodoCard from "./components/TodoCard";

interface Task {
  id: number;
  text: string;
  done: boolean;
  started?: boolean;
  deadline?: number;
  countdownValue?: number;
  countdownUnit?: 'seconds' | 'minutes';
  stoppedTimeLeft?: number;
  completed?: boolean;
}

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useLocalStorageState<Task[]>("tasks", { defaultValue: [] });

  function addTask(e: React.FormEvent<HTMLFormElement>, countdownValue: number, countdownUnit: "seconds" | "minutes") {
    e.preventDefault();
    if (!task.trim()) return;
    const id = Date.now() + Math.floor(Math.random() * 10000); // unique id
    setTasks([
      ...tasks,
      {
        id,
        text: task,
        done: false,
        started: false,
        countdownValue,
        countdownUnit,
      },
    ]);
    setTask("");
  }

  function startTask(id: number) {
    setTasks(
      tasks.map((t) => {
        if (t.id !== id) return t;
        if (t.started) return t;
        const ms = t.countdownUnit === "minutes" ? (t.countdownValue || 1) * 60 * 1000 : (t.countdownValue || 1) * 1000;
        return {
          ...t,
          started: true,
          deadline: Date.now() + ms,
        };
      })
    );
  }

  function toggleTask(id: number) {
    setTasks(
      tasks.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) {
          // Marking as done: store the remaining time
          let stoppedTimeLeft = 0;
          if (t.deadline) {
            stoppedTimeLeft = Math.max(0, Math.floor((t.deadline - Date.now()) / 1000));
          }
          return { ...t, done: true, stoppedTimeLeft };
        } else {
          // Marking as undone: remove stoppedTimeLeft and update deadline
          let newDeadline = t.deadline;
          if (t.stoppedTimeLeft !== undefined && t.stoppedTimeLeft > 0) {
            newDeadline = Date.now() + t.stoppedTimeLeft * 1000;
          }
          return { ...t, done: false, deadline: newDeadline, stoppedTimeLeft: undefined };
        }
      })
    );
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function completeTask(id: number) {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      )
    );
  }

  // Palette colors
  const cardColor = "var(--color-dark-blue)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-4 sm:px-4" style={{ background: 'var(--background)' }}>
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 tracking-tight text-center" style={{ color: 'var(--color-muted-blue)' }}>Daily Todo&apos;s</h1>
      <TodoCard
        tasks={tasks}
        task={task}
        setTask={setTask}
        addTask={addTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        completeTask={completeTask}
        startTask={startTask}
        cardBg={cardColor}
      />
      <footer className="mt-6 sm:mt-8 text-xs text-gray-400 text-center w-full">meyoussf2@GMAIL.COM</footer>
    </div>
  );
}
