import React from "react";
import TaskItem from "./TaskItem";

interface Task {
  id: number;
  text: string;
  done: boolean;
}


interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  completeTask: (id: number) => void;
  startTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, deleteTask, completeTask, startTask }) => {
  return (
    <ul className="w-full flex flex-col gap-3">
      {tasks.length === 0 && <li className="text-gray-400 text-center">No tasks yet!</li>}
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          completeTask={completeTask}
          startTask={startTask}
        />
      ))}
    </ul>
  );
};

export default TaskList; 