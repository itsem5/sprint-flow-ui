
import { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    type: 'story',
    status: 'todo',
    priority: 'high',
    storyPoints: 8,
    assignee: { name: 'John Doe', initials: 'JD' },
    reporter: { name: 'Jane Smith', initials: 'JS' },
    likes: 3,
    comments: 5,
    createdAt: '2024-01-15',
    labels: ['backend', 'security']
  },
  {
    id: '2',
    title: 'Design landing page',
    description: 'Create wireframes and mockups for the main landing page',
    type: 'task',
    status: 'in-progress',
    priority: 'medium',
    storyPoints: 5,
    assignee: { name: 'Alice Brown', initials: 'AB' },
    reporter: { name: 'Bob Wilson', initials: 'BW' },
    likes: 7,
    comments: 3,
    createdAt: '2024-01-14',
    labels: ['design', 'ui']
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    type: 'task',
    status: 'review',
    priority: 'urgent',
    storyPoints: 13,
    assignee: { name: 'Bob Wilson', initials: 'BW' },
    reporter: { name: 'John Doe', initials: 'JD' },
    likes: 2,
    comments: 8,
    createdAt: '2024-01-13',
    labels: ['devops', 'automation']
  },
  {
    id: '4',
    title: 'User profile page',
    description: 'Create user profile editing functionality',
    type: 'story',
    status: 'done',
    priority: 'low',
    storyPoints: 3,
    assignee: { name: 'Jane Smith', initials: 'JS' },
    reporter: { name: 'Alice Brown', initials: 'AB' },
    likes: 12,
    comments: 2,
    createdAt: '2024-01-12',
    labels: ['frontend', 'user']
  },
  {
    id: '5',
    title: 'Database optimization',
    description: 'Optimize database queries for better performance',
    type: 'task',
    status: 'todo',
    priority: 'medium',
    storyPoints: 5,
    assignee: { name: 'John Doe', initials: 'JD' },
    reporter: { name: 'Bob Wilson', initials: 'BW' },
    likes: 1,
    comments: 1,
    createdAt: '2024-01-16',
    labels: ['database', 'performance']
  }
];

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
];

const SprintBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dragCounter = useRef(0);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== columnId) {
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id
          ? { ...task, status: columnId as Task['status'] }
          : task
      );
      setTasks(updatedTasks);
    }
    setDraggedTask(null);
  };

  const getTasksByColumn = (columnId: string) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Sprint Board</h1>
              <p className="text-muted-foreground">Sprint 23 - Development Team</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByColumn(column.id);
            const isDragOver = dragOverColumn === column.id;

            return (
              <Card
                key={column.id}
                className={`min-h-[600px] transition-all duration-200 ${
                  isDragOver ? 'ring-2 ring-blue-400 shadow-lg' : ''
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <CardHeader className={`pb-3 ${column.color} rounded-t-lg`}>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">{column.title}</span>
                    <Badge variant="secondary" className="bg-white/80">
                      {columnTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      <TaskCard
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        isDragging={draggedTask?.id === task.id}
                      />
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default SprintBoard;
