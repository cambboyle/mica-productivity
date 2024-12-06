// src/components/TaskList.tsx
import React from "react";
import TaskItem from "./TaskItem";
import { Task } from "../types/Task";
import "./styles/task_list.css";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: "todo" | "in_progress" | "done") => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onStatusChange, onDelete }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
      {tasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. Create a new task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
