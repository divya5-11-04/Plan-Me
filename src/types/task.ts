export type Priority = 'High' | 'Medium' | 'Low';
export type Frequency = 'One-time' | 'Daily' | 'Weekly' | 'Monthly';
export type Category = 'Study/Work' | 'Health' | 'Social' | 'Spiritual';

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  frequency: Frequency;
  completed: boolean;
  createdAt: string;
  lastCompleted?: string;
  category: Category;
}

export interface Subtracker {
  id: string;
  name: string;
  progress: number;
  target: number;
  unit: string;
}

export interface CategoryStatus {
  total: number;
  completed: number;
  highPriorityTotal: number;
  highPriorityCompleted: number;
  status: 'success' | 'warning' | 'danger';
}