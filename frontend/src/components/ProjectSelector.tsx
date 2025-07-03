
import { useGetProjects } from "@/api/projects/project";
import { useProject } from "@/contexts/ProjectContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Badge, FolderOpen } from "lucide-react";

export function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useProject();
  const { data: projects, isLoading, isError } = useGetProjects();

  const handleProjectChange = (projectId: string) => {
    const project = projects?.find(p => p.id === projectId);
    setSelectedProject(project || null);
  };

  if (isLoading) {
    return <div className="flex items-center gap-3 min-w-64 text-muted-foreground">Loading projects...</div>;
  }

  if (isError) {
    return <div className="flex items-center gap-3 min-w-64 text-red-500">Error loading projects.</div>;
  }

  return (
    <div className="flex items-center gap-3 min-w-64">
      <FolderOpen className="w-5 h-5 text-muted-foreground" />
      <Select 
        value={selectedProject?.id || ""} 
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects?.map((project) => (
            <SelectItem key={project.id} value={project.id} className="flex items-center justify-between w-full">
              <SelectPrimitive.ItemText>{project.name}</SelectPrimitive.ItemText>
              <span 
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
