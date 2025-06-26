
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Target, Users } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  team: string;
  priority: 'low' | 'medium' | 'high';
  category: 'feature' | 'improvement' | 'bug' | 'epic';
}

const mockRoadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'User Authentication System',
    description: 'Complete overhaul of authentication with OAuth integration',
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    status: 'in-progress',
    progress: 65,
    team: 'Backend Team',
    priority: 'high',
    category: 'feature'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Native mobile applications for iOS and Android',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status: 'planned',
    progress: 0,
    team: 'Mobile Team',
    priority: 'high',
    category: 'feature'
  },
  {
    id: '3',
    title: 'API Performance Optimization',
    description: 'Improve API response times and reliability',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'completed',
    progress: 100,
    team: 'Backend Team',
    priority: 'medium',
    category: 'improvement'
  },
  {
    id: '4',
    title: 'Advanced Analytics Dashboard',
    description: 'Real-time analytics with custom dashboards',
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    status: 'planned',
    progress: 0,
    team: 'Frontend Team',
    priority: 'medium',
    category: 'feature'
  },
  {
    id: '5',
    title: 'Security Audit & Compliance',
    description: 'Comprehensive security review and GDPR compliance',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'planned',
    progress: 0,
    team: 'Security Team',
    priority: 'high',
    category: 'improvement'
  },
  {
    id: '6',
    title: 'Integration Platform',
    description: 'Third-party integrations and API marketplace',
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: 'planned',
    progress: 0,
    team: 'Platform Team',
    priority: 'low',
    category: 'epic'
  }
];

const statusColors = {
  'planned': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'delayed': 'bg-red-100 text-red-800'
};

const priorityColors = {
  'low': 'border-l-green-500',
  'medium': 'border-l-yellow-500',
  'high': 'border-l-red-500'
};

const categoryColors = {
  'feature': 'bg-blue-50 text-blue-700',
  'improvement': 'bg-green-50 text-green-700',
  'bug': 'bg-red-50 text-red-700',
  'epic': 'bg-purple-50 text-purple-700'
};

const Roadmap = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2024');
  const [roadmapItems] = useState<RoadmapItem[]>(mockRoadmapItems);
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline');

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getQuarterItems = () => {
    // For demo purposes, returning all items
    return roadmapItems;
  };

  const TimelineView = () => (
    <div className="space-y-6">
      {getQuarterItems().map((item) => (
        <Card key={item.id} className={`border-l-4 ${priorityColors[item.priority]} hover:shadow-lg transition-shadow`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant="secondary" className={statusColors[item.status]}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={categoryColors[item.category]}>
                    {item.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateRange(item.startDate, item.endDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {item.team}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const KanbanView = () => {
    const columns = [
      { id: 'planned', title: 'Planned', items: roadmapItems.filter(item => item.status === 'planned') },
      { id: 'in-progress', title: 'In Progress', items: roadmapItems.filter(item => item.status === 'in-progress') },
      { id: 'completed', title: 'Completed', items: roadmapItems.filter(item => item.status === 'completed') },
      { id: 'delayed', title: 'Delayed', items: roadmapItems.filter(item => item.status === 'delayed') }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">{column.title}</span>
                <Badge variant="secondary">{column.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.map((item) => (
                <Card key={item.id} className={`p-3 border-l-4 ${priorityColors[item.priority]}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <Badge variant="outline" className={`text-xs ${categoryColors[item.category]}`}>
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.team}</span>
                      <span>{item.progress}%</span>
                    </div>
                    {item.progress > 0 && (
                      <Progress value={item.progress} className="h-1" />
                    )}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Product Roadmap</h1>
              <p className="text-muted-foreground">Strategic planning and feature timeline</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'timeline' | 'kanban')}>
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roadmapItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roadmapItems.filter(item => item.status === 'in-progress').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roadmapItems.filter(item => item.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(roadmapItems.map(item => item.team)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedQuarter} Roadmap</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Q4 2023</Button>
                <Button variant="outline" size="sm">Q1 2024</Button>
                <Button size="sm">Q2 2024</Button>
                <Button variant="outline" size="sm">Q3 2024</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'timeline' ? <TimelineView /> : <KanbanView />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
