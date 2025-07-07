import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Priority, Frequency, Category, CategoryStatus } from '@/types/task';
import { Circle, CirclePlus } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  tasks: Task[];
  status: CategoryStatus;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  showSubtrackers?: boolean;
}

const categoryColors = {
  'Study/Work': 'study',
  'Health': 'health',
  'Social': 'social',
  'Spiritual': 'spiritual'
};

const statusColors = {
  success: 'bg-success',
  warning: 'bg-warning', 
  danger: 'bg-danger'
};

export const CategoryCard = ({ 
  category, 
  tasks, 
  status, 
  onAddTask, 
  onToggleTask,
  showSubtrackers = false 
}: CategoryCardProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    priority: 'Medium' as Priority,
    frequency: 'One-time' as Frequency
  });

  const handleAddTask = () => {
    if (!newTask.name.trim()) return;
    
    onAddTask({
      ...newTask,
      completed: false,
      category
    });
    
    setNewTask({ name: '', priority: 'Medium', frequency: 'One-time' });
    setIsAddingTask(false);
  };

  const categoryTasks = tasks.filter(task => task.category === category);

  return (
    <Card className="h-full flex flex-col transition-smooth hover:shadow-focus">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[status.status]}`} />
            {category}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {status.completed}/{status.total}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* Task List */}
        <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
          {categoryTasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center space-x-2 p-2 rounded-lg bg-secondary/50 transition-smooth hover:bg-secondary"
            >
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.name}
                </p>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Circle className={`w-2 h-2 fill-current ${
                    task.priority === 'High' ? 'text-danger' :
                    task.priority === 'Medium' ? 'text-warning' : 'text-success'
                  }`} />
                  <span>{task.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        {isAddingTask ? (
          <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
            <Input
              placeholder="Task name..."
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="text-sm"
            />
            <div className="flex space-x-2">
              <Select 
                value={newTask.priority} 
                onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={newTask.frequency} 
                onValueChange={(value: Frequency) => setNewTask({ ...newTask, frequency: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddTask} size="sm" className="flex-1 text-xs">
                Add
              </Button>
              <Button 
                onClick={() => setIsAddingTask(false)} 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => setIsAddingTask(true)}
            variant="outline"
            size="sm"
            className="w-full text-xs transition-smooth hover:bg-primary hover:text-primary-foreground"
          >
            <CirclePlus className="w-3 h-3 mr-1" />
            Add Task
          </Button>
        )}

        {/* Subtrackers for Study/Work */}
        {showSubtrackers && category === 'Study/Work' && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Progress Trackers</p>
            <div className="space-y-2">
              <div className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span>Curricular Learning</span>
                  <span>2/10 hrs</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};