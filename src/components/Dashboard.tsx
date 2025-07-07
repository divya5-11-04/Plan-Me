import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuoteSection } from './QuoteSection';
import { CategoryCard } from './CategoryCard';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { Task, Category, CategoryStatus } from '@/types/task';
import { saveTasks, loadTasks, shouldResetTask } from '@/lib/storage';

const categories: Category[] = ['Study/Work', 'Health', 'Social', 'Spiritual'];

export const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = loadTasks();
    
    // Reset tasks that need to be reset based on frequency
    const updatedTasks = loadedTasks.map(task => {
      if (task.completed && shouldResetTask(task)) {
        return { ...task, completed: false };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }, []);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          lastCompleted: completed ? new Date().toISOString() : task.lastCompleted
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getCategoryStatus = (category: Category): CategoryStatus => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const completed = categoryTasks.filter(task => task.completed).length;
    const highPriorityTasks = categoryTasks.filter(task => task.priority === 'High');
    const highPriorityCompleted = highPriorityTasks.filter(task => task.completed).length;
    
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (highPriorityTasks.length > 0) {
      if (highPriorityCompleted === 0) {
        status = 'danger';
      } else if (highPriorityCompleted < highPriorityTasks.length) {
        status = 'warning';
      } else {
        status = 'success';
      }
    } else if (categoryTasks.length > 0 && completed === 0) {
      status = 'warning';
    }
    
    return {
      total: categoryTasks.length,
      completed,
      highPriorityTotal: highPriorityTasks.length,
      highPriorityCompleted,
      status
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link to="/tracker">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View All Trackers
            </Button>
          </Link>
        </div>
        <QuoteSection />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              tasks={tasks}
              status={getCategoryStatus(category)}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              showSubtrackers={category === 'Study/Work'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};