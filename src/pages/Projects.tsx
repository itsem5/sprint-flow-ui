import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Users, Activity, Plus, Search, Filter } from "lucide-react";
import { Project } from "@/types/project";

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    description: 'A comprehensive online shopping platform with advanced features',
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
    successCriteria: ['Complete user authentication', 'Payment gateway integration', 'Mobile responsive design'],
    status: 'active',
    members: 8,
    epicCount: 3,
    storyCount: 12,
    taskCount: 45,
    ticketCounter: { story: 12, task: 45, 'sub-task': 23, bug: 8, issue: 5 }
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication',
    createdBy: 'Jane Smith',
    createdAt: '2024-02-01',
    successCriteria: ['Implement biometric login', 'Real-time transaction alerts', 'Offline mode support'],
    status: 'active',
    members: 6,
    epicCount: 2,
    storyCount: 8,
    taskCount: 32,
    ticketCounter: { story: 8, task: 32, 'sub-task': 15, bug: 4, issue: 2 }
  },
  {
    id: 'proj-3',
    name: 'Healthcare Management',
    description: 'Patient management system for healthcare providers',
    createdBy: 'Dr. Wilson',
    createdAt: '2023-11-20',
    successCriteria: ['HIPAA compliance', 'Electronic health records', 'Appointment scheduling'],
    status: 'completed',
    members: 5,
    epicCount: 4,
    storyCount: 15,
    taskCount: 67,
    ticketCounter: { story: 15, task: 67, 'sub-task': 34, bug: 12, issue: 7 }
  }
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: 'New Project',
      description: 'Project description',
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      successCriteria: [],
      status: 'active',
      members: 1,
      epicCount: 0,
      storyCount: 0,
      taskCount: 0,
      ticketCounter: { story: 0, task: 0, 'sub-task': 0, bug: 0, issue: 0 }
    };
    
    setProjects([...projects, newProject]);
    setIsCreateProjectOpen(false);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
  };

  const hasActiveFilters = searchQuery || selectedStatus !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Projects</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border appearance-none bg-white border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}

            <Button onClick={() => setIsCreateProjectOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>Created: {project.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Members: {project.members}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>Progress:</span>
                  <Progress value={(project.taskCount / 100) * 100} className="w-32" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Created by {project.createdBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {isCreateProjectOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <p>Are you sure you want to create a new project?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="ghost" onClick={() => setIsCreateProjectOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
