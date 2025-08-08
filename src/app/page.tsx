"use client";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { useAuth } from "../lib/useAuth";
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
  const { user, isLoading, error } = useAuth();
  const [showAuthSection, setShowAuthSection] = useState(false);

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
      {/* Header */}
      <div className="w-full max-w-xs sm:max-w-md mb-6 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-muted-blue)' }}>Daily Todo&apos;s</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAuthSection(!showAuthSection)}
            className="px-3 py-1 rounded font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {showAuthSection ? 'Hide' : 'Social Features'}
          </button>
        </div>
      </div>

      {/* Optional Authentication Section */}
      {showAuthSection && (
        <div className="w-full max-w-xs sm:max-w-md mb-6 p-4 rounded-lg" style={{ background: 'var(--color-dark-blue)', color: 'var(--color-off-white)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-muted-blue)' }}>Social Features</h3>
          
          {isLoading ? (
            <div className="text-sm">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-400">Error: {error}</div>
          ) : user ? (
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Welcome, {user.name || user.email}!</span>
              </div>
              <div className="text-xs text-gray-300 mb-3">
                🎉 You're logged in! Future features will include:
                <ul className="mt-2 space-y-1">
                  <li>• Share completed tasks on social media</li>
                  <li>• Sync tasks across devices</li>
                  <li>• Team collaboration</li>
                  <li>• Google/Facebook integration</li>
                </ul>
              </div>
              <a 
                href="/api/auth/logout" 
                className="px-3 py-1 rounded font-bold text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-gray-300 mb-3">
                🔧 Optional: Login to access future social features:
                <ul className="mt-2 space-y-1">
                  <li>• Share completed tasks on social media</li>
                  <li>• Sync tasks across devices</li>
                  <li>• Team collaboration</li>
                  <li>• Google/Facebook integration</li>
                </ul>
              </div>
              <a 
                href="/api/auth/login" 
                className="px-3 py-1 rounded font-bold text-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Login
              </a>
            </div>
          )}
        </div>
      )}

      {/* Todo Card - Always visible */}
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
