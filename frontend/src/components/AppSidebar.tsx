
import { Home, BarChart3, Calendar, List, Map, Settings, Users, FolderKanban } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserProfile } from "./UserProfile";
import { useProject } from "@/contexts/ProjectContext";

const menuItems = [
  {
    title: "Projects",
    basePath: "/projects",
    icon: Home,
  },
  {
    title: "Dashboard",
    basePath: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Sprint Board",
    basePath: "/sprint",
    icon: FolderKanban,
  },
  {
    title: "Backlog",
    basePath: "/backlog",
    icon: List,
  },
  {
    title: "Roadmap",
    basePath: "/roadmap",
    icon: Map,
  },
  {
    title: "Epics",
    basePath: "/epics",
    icon: List,
  },
];

const projectItems = [
  {
    title: "Team",
    basePath: "/team",
    icon: Users,
  },
  {
    title: "Settings",
    basePath: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { selectedProject } = useProject();

  const getLinkPath = (basePath: string) => {
    if (basePath === "/projects" || basePath === "/epics") return basePath;
    if (selectedProject) {
      return `/project/${selectedProject.id}${basePath}`;
    }
    return basePath; // Fallback if no project selected
  };

  const isLinkActive = (basePath: string) => {
    const fullPath = getLinkPath(basePath);
    return location.pathname.startsWith(fullPath);
  };

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">SprintFlow</h2>
            <p className="text-xs text-muted-foreground">Project Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Planning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isLinkActive(item.basePath)}>
                    <Link to={getLinkPath(item.basePath)} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isLinkActive(item.basePath)}>
                    <Link to={getLinkPath(item.basePath)} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />
        
        <div className="mt-auto pt-4">
          <UserProfile />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
