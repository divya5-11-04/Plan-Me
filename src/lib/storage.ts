import { Task, Subtracker, Category } from '@/types/task';

const TASKS_KEY = 'zen-dashboard-tasks';
const SUBTRACKERS_KEY = 'zen-dashboard-subtrackers';

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveSubtrackers = (subtrackers: Subtracker[]) => {
  localStorage.setItem(SUBTRACKERS_KEY, JSON.stringify(subtrackers));
};

export const loadSubtrackers = (): Subtracker[] => {
  const stored = localStorage.getItem(SUBTRACKERS_KEY);
  return stored ? JSON.parse(stored) : [
    { id: '1', name: 'Curricular Learning', progress: 0, target: 10, unit: 'hours' },
    { id: '2', name: 'Hackathons', progress: 0, target: 2, unit: 'events' },
    { id: '3', name: 'Extracurriculars', progress: 0, target: 5, unit: 'activities' }
  ];
};

export const shouldResetTask = (task: Task): boolean => {
  if (task.frequency === 'One-time' || !task.lastCompleted) {
    return false;
  }

  const lastCompleted = new Date(task.lastCompleted);
  const now = new Date();
  
  switch (task.frequency) {
    case 'Daily':
      return now.getDate() !== lastCompleted.getDate() || 
             now.getMonth() !== lastCompleted.getMonth() || 
             now.getFullYear() !== lastCompleted.getFullYear();
    case 'Weekly':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return lastCompleted < weekAgo;
    case 'Monthly':
      return now.getMonth() !== lastCompleted.getMonth() || 
             now.getFullYear() !== lastCompleted.getFullYear();
    default:
      return false;
  }
};