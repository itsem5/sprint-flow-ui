
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Calendar, User, Target, Users, FolderKanban, List, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/types/project";

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
    successCriteria: [
      'Complete user authentication system',
      'Implement payment gateway integration',
      'Deploy to production with 99.9% uptime'
    ],
    status: 'active',
    members: 8,
    epicCount: 3,
    storyCount: 15,
    taskCount: 45
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for task management',
    createdBy: 'Jane Smith',
    createdAt: '2024-02-01',
    successCriteria: [
      'Launch on both iOS and Android',
      'Achieve 10,000+ downloads in first month',
      'Maintain 4.5+ star rating'
    ],
    status: 'active',
    members: 5,
    epicCount: 2,
    storyCount: 12,
    taskCount: 28
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence',
    createdBy: 'Bob Wilson',
    createdAt: '2023-12-10',
    successCriteria: [
      'Process 1M+ data points daily',
      'Sub-second query response times',
      'Support 100+ concurrent users'
    ],
    status: 'completed',
    members: 6,
    epicCount: 4,
    storyCount: 20,
    taskCount: 60
  }
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    successCriteria: ''
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      successCriteria: newProject.successCriteria.split('\n').filter(criteria => criteria.trim()),
      status: 'active',
      members: 1,
      epicCount: 0,
      storyCount: 0,
      taskCount: 0
    };
    
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', successCriteria: '' });
    setIsCreateModalOpen(false);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage your project portfolio</p>
            </div>
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
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Name</label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Describe your project"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Success Criteria (one per line)</label>
                    <Textarea
                      value={newProject.successCriteria}
                      onChange={(e) => setNewProject({...newProject, successCriteria: e.target.value})}
                      placeholder="Define success criteria for this project"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject} disabled={!newProject.name}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <Link to={`/project/${project.id}`} className="hover:text-blue-600">
                        {project.name}
                      </Link>
                    </CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{project.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{project.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{project.members} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-muted-foreground" />
                    <span>{project.taskCount} tasks</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Success Criteria
                  </h4>
                  <ul className="space-y-1">
                    {project.successCriteria.slice(0, 2).map((criteria, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {criteria}
                      </li>
                    ))}
                    {project.successCriteria.length > 2 && (
                      <li className="text-xs text-muted-foreground">
                        +{project.successCriteria.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <Link to={`/project/${project.id}/backlog`}>
                    <Button variant="ghost" size="sm">
                      <List className="w-4 h-4 mr-1" />
                      Backlog
                    </Button>
                  </Link>
                  <Link to={`/project/${project.id}/sprint`}>
                    <Button variant="ghost" size="sm">
                      <FolderKanban className="w-4 h-4 mr-1" />
                      Sprint
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
