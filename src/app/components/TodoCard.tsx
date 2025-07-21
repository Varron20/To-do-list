import React, { useState } from "react";
import Button from "./Button";
import TaskList from "./TaskList";

interface Task {
  id: number;
  text: string;
  done: boolean;
  deadline?: number;
}

interface TodoCardProps {
  tasks: Task[];
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  addTask: (e: React.FormEvent<HTMLFormElement>, countdown: number, unit: 'seconds' | 'minutes') => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  completeTask: (id: number) => void;
  startTask: (id: number) => void;
  cardBg: string;
}

const TodoCard: React.FC<TodoCardProps> = ({
  tasks,
  task,
  setTask,
  addTask,
  toggleTask,
  deleteTask,
  completeTask,
  startTask,
  cardBg,
}) => {
  const [countdown, setCountdown] = useState(1); // default 1
  const [unit, setUnit] = useState<'seconds' | 'minutes'>('minutes');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    addTask(e, countdown, unit);
    setCountdown(1);
    setUnit('minutes');
  };

  return (
    <div className="rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md flex flex-col items-center" style={{ background: cardBg, color: 'var(--color-off-white)' }}>
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 mb-6 items-stretch">
        <div className="flex flex-row w-full gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg border-none outline-none bg-[var(--color-off-white)] text-[var(--color-dark-blue)] font-medium placeholder:text-gray-400 min-w-0 text-sm sm:text-base"
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Add a task"
          />
          <input
            type="number"
            min={1}
            max={unit === 'minutes' ? 120 : 3600}
            value={countdown}
            onChange={e => setCountdown(Number(e.target.value))}
            className="w-14 sm:w-16 px-2 py-2 rounded-lg border-none outline-none bg-[var(--color-off-white)] text-[var(--color-dark-blue)] font-medium text-xs sm:text-sm flex-shrink-0"
            title={`Countdown (${unit})`}
          />
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as 'seconds' | 'minutes')}
            className="px-2 py-2 rounded-lg border-none outline-none bg-[var(--color-off-white)] text-[var(--color-dark-blue)] font-medium text-xs sm:text-sm flex-shrink-0"
          >
            <option value="seconds">sec</option>
            <option value="minutes">min</option>
          </select>
        </div>
        <Button type="submit" className="w-full h-full px-4 py-2 rounded-lg font-semibold flex items-center justify-center whitespace-nowrap text-sm sm:text-base">
          Add Task
        </Button>
      </form>
      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} completeTask={completeTask} startTask={startTask} />
    </div>
  );
};

export default TodoCard; 