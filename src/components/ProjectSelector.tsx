
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/contexts/ProjectContext";
import { useStaticData } from "@/hooks/useStaticData";
import { FolderOpen } from "lucide-react";

export function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useProject();
  const data = useStaticData();

  const projects = data?.projects || [];

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
  };

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
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center justify-between w-full">
                <span>{project.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
