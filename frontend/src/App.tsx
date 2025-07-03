
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AppSidebar } from "@/components/AppSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import SprintBoard from "./pages/SprintBoard";
import Backlog from "./pages/Backlog";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateOrganization from "./pages/CreateOrganization";
import CreateProject from "./pages/CreateProject";
import UpdateProject from "./pages/UpdateProject";
import UpdateOrganization from "./pages/UpdateOrganization";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppLayout = () => (
  <ProjectProvider>
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  </ProjectProvider>
);

import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/create" element={<CreateProject />} />
                <Route path="/projects/:projectId/edit" element={<UpdateProject />} />
                <Route path="/project/:projectId" element={<Dashboard />} />
                <Route path="/project/:projectId/sprint" element={<SprintBoard />} />
                <Route path="/project/:projectId/backlog" element={<Backlog />} />
                <Route path="/project/:projectId/roadmap" element={<Roadmap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sprint" element={<SprintBoard />} />
                <Route path="/backlog" element={<Backlog />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/organization/:organizationId/edit" element={<UpdateOrganization />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
