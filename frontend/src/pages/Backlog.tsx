
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { Plus, Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useStaticData, TaskWithDetails } from "@/hooks/useStaticData";

const Backlog = () => {
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['epics', 'stories', 'tasks']));
  const data = useStaticData();

  const tasks = data?.tasks || [];

  const handleTaskClick = (task: TaskWithDetails) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: TaskWithDetails) => {
    setSelectedTask(updatedTask);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const epics = filteredTasks.filter(task => task.type === 'epic');
  const stories = filteredTasks.filter(task => task.type === 'story');
  const taskItems = filteredTasks.filter(task => task.type === 'task');

  const getTotalStoryPoints = (taskList: TaskWithDetails[]) => {
    return taskList.reduce((total, task) => total + task.storyPoints, 0);
  };

  // Convert TaskWithDetails to the format expected by TaskCard
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
    likes: task.likes,
    comments: task.comments,
    createdAt: new Date(task.createdAt).toLocaleDateString(),
    labels: task.labels
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Product Backlog</h1>
              <p className="text-muted-foreground">
                {filteredTasks.length} items • {getTotalStoryPoints(filteredTasks)} story points
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search backlog..."
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
              Add Item
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Epics Section */}
          <Card>
            <Collapsible
              open={expandedSections.has('epics')}
              onOpenChange={() => toggleSection('epics')}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedSections.has('epics') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <span>Epics</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {epics.length}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {getTotalStoryPoints(epics)} points
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {epics.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={convertTaskForCard(task)}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                  {epics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No epics found</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Stories Section */}
          <Card>
            <Collapsible
              open={expandedSections.has('stories')}
              onOpenChange={() => toggleSection('stories')}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedSections.has('stories') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <span>Stories</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {stories.length}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {getTotalStoryPoints(stories)} points
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={convertTaskForCard(task)}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                  {stories.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No stories found</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Tasks Section */}
          <Card>
            <Collapsible
              open={expandedSections.has('tasks')}
              onOpenChange={() => toggleSection('tasks')}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedSections.has('tasks') ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <span>Tasks</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {taskItems.length}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {getTotalStoryPoints(taskItems)} points
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {taskItems.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={convertTaskForCard(task)}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                  {taskItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks found</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
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

export default Backlog;
