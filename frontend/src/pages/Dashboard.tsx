import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target, AlertCircle, CheckCircle } from "lucide-react";
import { ProjectSelector } from "@/components/ProjectSelector";
import { useProject } from "@/contexts/ProjectContext";

const sprintData = [
  { name: 'Sprint 19', planned: 45, completed: 42 },
  { name: 'Sprint 20', planned: 38, completed: 35 },
  { name: 'Sprint 21', planned: 52, completed: 48 },
  { name: 'Sprint 22', planned: 41, completed: 38 },
  { name: 'Sprint 23', planned: 47, completed: 32 },
];

const burndownData = [
  { day: 'Day 1', remaining: 45 },
  { day: 'Day 2', remaining: 42 },
  { day: 'Day 3', remaining: 38 },
  { day: 'Day 4', remaining: 35 },
  { day: 'Day 5', remaining: 32 },
  { day: 'Day 6', remaining: 28 },
  { day: 'Day 7', remaining: 25 },
  { day: 'Day 8', remaining: 22 },
  { day: 'Day 9', remaining: 18 },
  { day: 'Day 10', remaining: 15 },
];

const teamMembers = [
  { name: 'John Doe', initials: 'JD', tasksCompleted: 12, tasksInProgress: 3 },
  { name: 'Jane Smith', initials: 'JS', tasksCompleted: 8, tasksInProgress: 2 },
  { name: 'Bob Wilson', initials: 'BW', tasksCompleted: 15, tasksInProgress: 4 },
  { name: 'Alice Brown', initials: 'AB', tasksCompleted: 10, tasksInProgress: 1 },
];

const Dashboard = () => {
  const { selectedProject } = useProject();

  // Task-related metrics will not function without a data source.
  // You will need to fetch tasks from the backend based on the selectedProject.
  const totalTasks = 0;
  const completedTasks = 0;
  const progressPercentage = 0;

  const taskDistribution = [
    { name: 'To Do', value: 0, color: '#e2e8f0' },
    { name: 'In Progress', value: 0, color: '#3b82f6' },
    { name: 'Review', value: 0, color: '#f59e0b' },
    { name: 'Done', value: 0, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Project Dashboard</h1>
                <ProjectSelector />
              </div>
              <p className="text-muted-foreground">
                {selectedProject ? `${selectedProject.name} - Sprint Progress` : 'Select a project to view progress'}
              </p>
            </div>
          </div>
        </div>

        {!selectedProject ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
              <p className="text-muted-foreground">Please select a project from the dropdown above to view the dashboard.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                  <Progress value={progressPercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">150</div>
                  <p className="text-xs text-muted-foreground">
                    Story points in project
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active Project
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    Issues in progress
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      3 High Priority
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active contributors
                  </p>
                  <div className="flex -space-x-2 mt-2">
                    {teamMembers.slice(0, 3).map((member) => (
                      <Avatar key={member.name} className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    {teamMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{teamMembers.length - 3}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sprint Velocity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sprint Velocity</CardTitle>
                  <CardDescription>
                    Planned vs Completed story points over the last 5 sprints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sprintData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="planned" fill="#e2e8f0" name="Planned" />
                      <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Burndown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sprint Burndown</CardTitle>
                  <CardDescription>
                    Remaining work over time for current sprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={burndownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="remaining" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Distribution</CardTitle>
                  <CardDescription>
                    Current project task status breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={taskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>
                    Individual team member contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.tasksCompleted} completed, {member.tasksInProgress} in progress
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {member.tasksCompleted}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Clock className="w-3 h-3 mr-1" />
                            {member.tasksInProgress}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
