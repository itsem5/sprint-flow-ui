import { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { CreateStoryModal } from "@/components/CreateStoryModal";
import { ColumnCustomizer } from "@/components/ColumnCustomizer";
import { SprintManager, Sprint } from "@/components/SprintManager";
import { TaskMoveModal } from "@/components/TaskMoveModal";
import { TaskBreadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";
import { Plus, Filter, Search, Settings, X, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KanbanColumn } from "@/types/project";
import { useStaticData, TaskWithDetails } from "@/hooks/useStaticData";

const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100', order: 0 },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', order: 1 },
  { id: 'review', title: 'Review', color: 'bg-yellow-100', order: 2 },
  { id: 'done', title: 'Done', color: 'bg-green-100', order: 3 }
];

// Mock sprints data
const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 23',
    description: 'User authentication and profile management features',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    status: 'active',
    tasks: []
  },
  {
    id: 'sprint-2',
    name: 'Sprint 24',
    description: 'Dashboard improvements and analytics',
    startDate: '2024-01-30',
    endDate: '2024-02-13',
    status: 'planning',
    tasks: []
  }
];

const SprintBoard = () => {
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [isSprintManagerOpen, setIsSprintManagerOpen] = useState(false);
  const [isTaskMoveModalOpen, setIsTaskMoveModalOpen] = useState(false);
  const [taskToMove, setTaskToMove] = useState<TaskWithDetails | null>(null);
  const [draggedTask, setDraggedTask] = useState<TaskWithDetails | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(mockSprints[0]);
  const dragCounter = useRef(0);
  const data = useStaticData();

  // Load tasks from static data
  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  // Mock breadcrumb data - in real app this would come from route params/context
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'E-commerce Platform', url: '/project/1' },
    { title: 'User Management Epic', url: '/project/1/epic/1' },
    { title: 'Authentication Story', url: '/project/1/story/1' },
    { title: 'Sprint Board', isActive: true }
  ];

  // Get unique assignees for filter
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee.name)));

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAssignee = selectedAssignee === 'all' || task.assignee.name === selectedAssignee;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesType = selectedType === 'all' || task.type === selectedType;

    return matchesSearch && matchesAssignee && matchesPriority && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAssignee('all');
    setSelectedPriority('all');
    setSelectedType('all');
  };

  const hasActiveFilters = searchQuery || selectedAssignee !== 'all' || selectedPriority !== 'all' || selectedType !== 'all';

  const handleTaskClick = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: TaskWithDetails) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
  };

  const handleCreateSprint = (sprintData: Omit<Sprint, 'id' | 'tasks'>) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: `sprint-${Date.now()}`,
      tasks: []
    };
    setSprints([...sprints, newSprint]);
  };

  const handleUpdateSprint = (sprintId: string, updates: Partial<Sprint>) => {
    setSprints(sprints.map(sprint => 
      sprint.id === sprintId ? { ...sprint, ...updates } : sprint
    ));
  };

  const handleSprintChange = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    setCurrentSprint(sprint || null);
  };

  const handleMoveTask = (taskId: string, targetSprintId: string | null) => {
    console.log(`Moving task ${taskId} to ${targetSprintId || 'backlog'}`);
    // In a real app, this would update the task's sprint assignment
  };

  const openTaskMoveModal = (task: TaskWithDetails) => {
    setTaskToMove(task);
    setIsTaskMoveModalOpen(true);
  };

  const handleCreateStory = (storyData: { name: string; description: string; epicId: string }) => {
    console.log('Creating story:', storyData);
    // In a real app, this would create a new story
  };

  const handleDragStart = (e: React.DragEvent, task: TaskWithDetails) => {
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
          ? { ...task, status: columnId as TaskWithDetails['status'] }
          : task
      );
      setTasks(updatedTasks);
    }
    setDraggedTask(null);
  };

  const getTasksByColumn = (columnId: string) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  // Convert TaskWithDetails to the format expected by TaskCard (removed likes and comments)
  const convertTaskForCard = (task: TaskWithDetails) => ({
    id: task.id,
    title: task.name,
    description: task.description,
    type: task.type,
    status: task.status,
    priority: task.priority,
    storyPoints: task.storyPoints,
    assignee: {
      name: task.assignee.name,
      initials: task.assignee.initials,
      avatar: task.assignee.avatar
    },
    reporter: {
      name: task.reporter.name,
      initials: task.reporter.initials,
      avatar: task.reporter.avatar
    },
    createdAt: new Date(task.createdAt).toLocaleDateString(),
    labels: task.labels,
    onMove: () => openTaskMoveModal(task)
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <TaskBreadcrumb items={breadcrumbItems} />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Sprint Board</h1>
                {currentSprint && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    {currentSprint.name}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {currentSprint ? `${currentSprint.description} • Development Team` : 'No active sprint'}
              </p>
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
            
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="sub-task">Sub-task</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => setIsSprintManagerOpen(true)}>
              <Calendar className="w-4 h-4 mr-2" />
              Sprints
            </Button>

            <Button variant="outline" size="sm" onClick={() => setIsColumnCustomizerOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            
            <Button size="sm" onClick={() => setIsCreateStoryModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Story
            </Button>
          </div>
        </div>

        <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {columns.sort((a, b) => a.order - b.order).map((column) => {
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/80">
                        {columnTasks.length}
                      </Badge>
                    </div>
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
                        task={convertTaskForCard(task)}
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

      <SprintManager
        isOpen={isSprintManagerOpen}
        onClose={() => setIsSprintManagerOpen(false)}
        sprints={sprints}
        onCreateSprint={handleCreateSprint}
        onUpdateSprint={handleUpdateSprint}
        currentSprint={currentSprint}
        onSprintChange={handleSprintChange}
      />

      <TaskMoveModal
        isOpen={isTaskMoveModalOpen}
        onClose={() => setIsTaskMoveModalOpen(false)}
        task={taskToMove}
        sprints={sprints}
        currentSprint={currentSprint}
        onMoveTask={handleMoveTask}
      />

      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setIsCreateStoryModalOpen(false)}
        onCreateStory={handleCreateStory}
        projectId="proj-1"
      />

      <ColumnCustomizer
        isOpen={isColumnCustomizerOpen}
        onClose={() => setIsColumnCustomizerOpen(false)}
        columns={columns}
        onUpdateColumns={setColumns}
      />
    </div>
  );
};

export default SprintBoard;
