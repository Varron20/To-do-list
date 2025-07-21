import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  text: string;
  done: boolean;
  deadline?: number; // timestamp in ms
  stoppedTimeLeft?: number; // timestamp in ms
  completed?: boolean; // Added for new logic
  started?: boolean; // Added for new logic
  countdownValue?: number; // Added for new logic
  countdownUnit?: 'minutes' | 'seconds'; // Added for new logic
}

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  completeTask: (id: number) => void;
  startTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTask, deleteTask, completeTask, startTask }) => {
  const getInitialTimeLeft = () => {
    if (task.done && task.stoppedTimeLeft !== undefined) {
      return task.stoppedTimeLeft;
    } else if (task.started && task.deadline) {
      return Math.max(0, Math.floor((task.deadline - Date.now()) / 1000));
    } else if (!task.started && task.countdownValue) {
      return task.countdownUnit === 'minutes' ? task.countdownValue * 60 : task.countdownValue;
    }
    return null;
  };
  const [timeLeft, setTimeLeft] = useState<number | null>(getInitialTimeLeft());

  // Reset timer when task is started
  React.useEffect(() => {
    setTimeLeft(getInitialTimeLeft());
    // eslint-disable-next-line
  }, [task.started, task.deadline, task.done]);

  useEffect(() => {
    if (!task.deadline || task.done) return;
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [task.deadline, timeLeft, task.done]);

  // Format timeLeft as mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isExpired = !task.done && timeLeft === 0;

  return (
    <li
      className={`flex items-center gap-1 rounded-lg px-2 py-1 shadow-sm ${task.completed ? "bg-[#C7D9DD]" : isExpired ? "bg-[#9B7EBD]" : "bg-[var(--color-off-white)]"}`}
    >
      <span className={`flex-1 font-medium ${task.completed ? 'line-through text-gray-400' : task.done ? 'line-through text-gray-400' : 'text-black'}`}>{task.text}
        {!task.started && !task.completed && task.countdownValue && (
          <span className="ml-2 text-xs text-gray-500 font-normal">Planned: {task.countdownValue} {task.countdownUnit === 'minutes' ? (task.countdownValue === 1 ? 'min' : 'mins') : (task.countdownValue === 1 ? 'sec' : 'secs')}</span>
        )}
        {task.completed && (
          <span className="ml-2 text-xs text-green-700 font-normal">completed</span>
        )}
        {isExpired && !task.completed && (
          <span className="ml-2 text-xs text-gray-200 font-normal">expired</span>
        )}
      </span>
      {!task.started && !task.completed && (
        <button
          type="button"
          className="px-3 py-1 rounded font-bold text-xs mr-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
          onClick={() => startTask(task.id)}
        >
          Start
        </button>
      )}
      {task.started && !task.completed && task.deadline && (
        <>
          <span className={`text-xs font-mono ${isExpired ? "text-white" : task.done ? "text-gray-400" : "text-[var(--color-black)]"}`}>
            {formatTime(timeLeft ?? 0)}
            {task.done && <span className="ml-1 text-[10px] font-semibold uppercase text-gray-400">Stopped</span>}
          </span>
          {!isExpired && (
            <button
              type="button"
              className="px-3 py-1 rounded font-bold text-xs mr-2 bg-[var(--color-muted-blue)] text-[var(--color-off-white)] hover:bg-[var(--color-dark-blue)] hover:text-[var(--color-off-white)] transition-colors"
              onClick={() => toggleTask(task.id)}
            >
              {task.done ? 'Continue' : 'Pause'}
            </button>
          )}
          <div className="flex flex-row items-center gap-1">
            {!task.completed && !isExpired && (
              <button
                type="button"
                className="px-3 py-1 rounded font-bold text-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={() => completeTask(task.id)}
              >
                Done
              </button>
            )}
            <button
              type="button"
              className="px-3 py-1 rounded font-bold text-xs bg-[var(--color-muted-blue)] text-[var(--color-off-white)] hover:bg-[var(--color-dark-blue)] hover:text-[var(--color-off-white)] transition-colors"
              onClick={() => deleteTask(task.id)}
              aria-label="Delete task"
            >
              Remove
            </button>
          </div>
        </>
      )}
      {task.completed && (
        <button
          type="button"
          className="px-3 py-1 rounded font-bold text-xs bg-[var(--color-muted-blue)] text-[var(--color-off-white)] hover:bg-[var(--color-dark-blue)] hover:text-[var(--color-off-white)] transition-colors"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          Remove
        </button>
      )}
    </li>
  );
};

export default TaskItem; 