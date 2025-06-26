
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target, AlertCircle, CheckCircle } from "lucide-react";

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

const taskDistribution = [
  { name: 'To Do', value: 12, color: '#e2e8f0' },
  { name: 'In Progress', value: 8, color: '#3b82f6' },
  { name: 'Review', value: 5, color: '#f59e0b' },
  { name: 'Done', value: 22, color: '#10b981' },
];

const teamMembers = [
  { name: 'John Doe', initials: 'JD', tasksCompleted: 12, tasksInProgress: 3 },
  { name: 'Jane Smith', initials: 'JS', tasksCompleted: 8, tasksInProgress: 2 },
  { name: 'Bob Wilson', initials: 'BW', tasksCompleted: 15, tasksInProgress: 4 },
  { name: 'Alice Brown', initials: 'AB', tasksCompleted: 10, tasksInProgress: 1 },
];

const Dashboard = () => {
  const totalTasks = taskDistribution.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = taskDistribution.find(item => item.name === 'Done')?.value || 0;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Project Dashboard</h1>
            <p className="text-muted-foreground">Sprint 23 - Week 2 Progress</p>
          </div>
        </div>

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
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                Story points per sprint
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +8% from last sprint
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
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">
                Issues in progress
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">5 High Priority</Badge>
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
                Current sprint task status breakdown
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
      </div>
    </div>
  );
};

export default Dashboard;
