// src/components/TaskItem.tsx
import React from "react";

interface TaskItemProps {
  task: any;
  handleEdit: (task: any) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, handleEdit }) => {
  return (
    <div className="">
      <h3 className="">{task.title}</h3>
      <p className="">{task.description || "No description"}</p>
      <p className="">Priority: {task.priority}</p>
      <p className="">Due: {task.dueDate || ""}</p>
      <button onClick={() => handleEdit(task)} className="">
        Edit
      </button>
    </div>
  );
};

export default TaskItem;
