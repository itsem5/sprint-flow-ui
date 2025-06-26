
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SprintBoard from "./pages/SprintBoard";
import Backlog from "./pages/Backlog";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/project/:projectId" element={<Dashboard />} />
                <Route path="/project/:projectId/sprint" element={<SprintBoard />} />
                <Route path="/project/:projectId/backlog" element={<Backlog />} />
                <Route path="/project/:projectId/roadmap" element={<Roadmap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sprint" element={<SprintBoard />} />
                <Route path="/backlog" element={<Backlog />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
