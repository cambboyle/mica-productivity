// src/components/TaskList.tsx
import React from "react";
import TaskItem from "./TaskItem";

interface TaskListProps {
  filteredTasks: any[];
  handleEdit: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filteredTasks, handleEdit }) => {
  return (
    <div className="">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} handleEdit={handleEdit} />
      ))}
    </div>
  );
};

export default TaskList;
