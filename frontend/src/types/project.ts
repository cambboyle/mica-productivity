import { Task } from './Task';

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  color: string;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  tasks: Task[];
  order: number;
  createdAt: string;
  updatedAt: string;
}
