export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  userId?: string;
  projectId: string;
  tags: string[];
}

export type TaskFormData = Omit<Task, 'id' | 'userId'>;

export const initialTaskState: TaskFormData = {
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'medium',
  status: 'todo',
  projectId: '',
  tags: []
};
