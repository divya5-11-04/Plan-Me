import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, ArrowLeft, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackerItem {
  id: string;
  name: string;
  deadline: string;
  estimatedTime: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

const HACKATHONS_KEY = 'zen-dashboard-hackathons';
const COURSES_KEY = 'zen-dashboard-courses';
const PROJECTS_KEY = 'zen-dashboard-projects';
const CONTESTS_KEY = 'zen-dashboard-contests';

interface ContestTracker {
  id: string;
  platform: string;
  questionsCompleted: number;
  totalQuestions?: number;
  lastUpdated: string;
}

const Tracker = () => {
  const [hackathons, setHackathons] = useState<TrackerItem[]>([]);
  const [courses, setCourses] = useState<TrackerItem[]>([]);
  const [projects, setProjects] = useState<TrackerItem[]>([]);
  const [contests, setContests] = useState<ContestTracker[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedHackathons = localStorage.getItem(HACKATHONS_KEY);
      const savedCourses = localStorage.getItem(COURSES_KEY);
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      const savedContests = localStorage.getItem(CONTESTS_KEY);

      if (savedHackathons) setHackathons(JSON.parse(savedHackathons));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedContests) {
        setContests(JSON.parse(savedContests));
      } else {
        // Initialize with default platforms
        const defaultContests: ContestTracker[] = [
          { id: '1', platform: 'Leetcode', questionsCompleted: 0, totalQuestions: 3000, lastUpdated: new Date().toISOString() },
          { id: '2', platform: 'Codechef', questionsCompleted: 0, lastUpdated: new Date().toISOString() },
          { id: '3', platform: 'Codeforces', questionsCompleted: 0, lastUpdated: new Date().toISOString() },
          { id: '4', platform: 'HackerRank', questionsCompleted: 0, lastUpdated: new Date().toISOString() }
        ];
        setContests(defaultContests);
        localStorage.setItem(CONTESTS_KEY, JSON.stringify(defaultContests));
      }
    };
    loadData();
  }, []);

  const saveData = (type: string, data: TrackerItem[]) => {
    localStorage.setItem(type, JSON.stringify(data));
  };

  const addItem = (type: 'hackathons' | 'courses' | 'projects', item: Omit<TrackerItem, 'id'>) => {
    const newItem: TrackerItem = {
      ...item,
      id: crypto.randomUUID()
    };

    if (type === 'hackathons') {
      const updated = [...hackathons, newItem];
      setHackathons(updated);
      saveData(HACKATHONS_KEY, updated);
    } else if (type === 'courses') {
      const updated = [...courses, newItem];
      setCourses(updated);
      saveData(COURSES_KEY, updated);
    } else {
      const updated = [...projects, newItem];
      setProjects(updated);
      saveData(PROJECTS_KEY, updated);
    }
  };

  const updateStatus = (type: 'hackathons' | 'courses' | 'projects', id: string, status: TrackerItem['status']) => {
    const updateList = (items: TrackerItem[]) => 
      items.map(item => item.id === id ? { ...item, status } : item);

    if (type === 'hackathons') {
      const updated = updateList(hackathons);
      setHackathons(updated);
      saveData(HACKATHONS_KEY, updated);
    } else if (type === 'courses') {
      const updated = updateList(courses);
      setCourses(updated);
      saveData(COURSES_KEY, updated);
    } else {
      const updated = updateList(projects);
      setProjects(updated);
      saveData(PROJECTS_KEY, updated);
    }
  };

  const getStatusColor = (status: TrackerItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: TrackerItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const updateContestProgress = (id: string, questionsCompleted: number) => {
    const updated = contests.map(contest => 
      contest.id === id 
        ? { ...contest, questionsCompleted, lastUpdated: new Date().toISOString() }
        : contest
    );
    setContests(updated);
    localStorage.setItem(CONTESTS_KEY, JSON.stringify(updated));
  };

  const ContestSection = () => {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Contest Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.map((contest) => (
              <div key={contest.id} className="p-4 bg-card/50 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{contest.platform}</h4>
                  <Badge variant="secondary">
                    {contest.questionsCompleted}
                    {contest.totalQuestions && `/${contest.totalQuestions}`} questions
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    type="number"
                    min="0"
                    value={contest.questionsCompleted}
                    onChange={(e) => updateContestProgress(contest.id, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">questions completed</span>
                </div>
                
                {contest.totalQuestions && (
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((contest.questionsCompleted / contest.totalQuestions) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(contest.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TrackerSection = ({ 
    title, 
    items, 
    type, 
    icon: Icon 
  }: { 
    title: string; 
    items: TrackerItem[]; 
    type: 'hackathons' | 'courses' | 'projects';
    icon: any;
  }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      deadline: '',
      estimatedTime: '',
      priority: 'medium' as TrackerItem['priority']
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.deadline) {
        addItem(type, {
          ...formData,
          status: 'not-started'
        });
        setFormData({ name: '', deadline: '', estimatedTime: '', priority: 'medium' });
        setShowForm(false);
      }
    };

    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant="outline" 
            size="sm"
          >
            Add {title.slice(0, -1)}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
              <Input
                placeholder="Estimated time (e.g., 2 weeks, 40 hours)"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TrackerItem['priority'] })}
                className="w-full p-2 rounded border bg-background"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Add</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-4 bg-card/50 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.deadline).toLocaleDateString()}
                  </div>
                  {item.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.estimatedTime}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={item.status === 'not-started' ? 'default' : 'outline'}
                    onClick={() => updateStatus(type, item.id, 'not-started')}
                  >
                    Not Started
                  </Button>
                  <Button
                    size="sm"
                    variant={item.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => updateStatus(type, item.id, 'in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={item.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => updateStatus(type, item.id, 'completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Tracker</h1>
        </div>

        <div className="grid gap-8">
          <ContestSection />
          
          <TrackerSection
            title="Hackathons"
            items={hackathons}
            type="hackathons"
            icon={Target}
          />
          
          <TrackerSection
            title="Courses"
            items={courses}
            type="courses"
            icon={Calendar}
          />
          
          <TrackerSection
            title="Projects"
            items={projects}
            type="projects"
            icon={Clock}
          />
        </div>
      </div>
    </div>
  );
};

export default Tracker;