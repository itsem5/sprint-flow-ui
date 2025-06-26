
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FolderKanban, List, Map, Zap, Users, Calendar, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to SprintFlow
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Your comprehensive project management platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-lg">Dashboard</CardTitle>
              <CardDescription>
                View project analytics and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FolderKanban className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-lg">Sprint Board</CardTitle>
              <CardDescription>
                Manage tasks with Kanban workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/sprint">
                <Button className="w-full">Open Sprint Board</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <List className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <List className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <CardTitle className="text-lg">Backlog</CardTitle>
              <CardDescription>
                Manage pending tasks and stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/backlog">
                <Button className="w-full">View Backlog</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Map className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <Map className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <CardTitle className="text-lg">Roadmap</CardTitle>
              <CardDescription>
                Plan and track project timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/roadmap">
                <Button className="w-full">View Roadmap</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Agile Planning</h4>
                    <p className="text-sm text-muted-foreground">Sprint planning, story points, and velocity tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <FolderKanban className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Kanban Boards</h4>
                    <p className="text-sm text-muted-foreground">Drag & drop task management with custom workflows</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <BarChart3 className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">Burndown charts, velocity reports, and progress tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Team Collaboration</h4>
                    <p className="text-sm text-muted-foreground">Comments, mentions, and real-time updates</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Sprints</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground text-center">68% Sprint Progress</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
