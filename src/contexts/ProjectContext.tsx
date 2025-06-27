
import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@/types/project';

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projectTags: string[];
  addProjectTag: (tag: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTags, setProjectTags] = useState<string[]>([
    'bug', 'feature', 'enhancement', 'documentation', 'testing'
  ]);

  const addProjectTag = (tag: string) => {
    if (!projectTags.includes(tag)) {
      setProjectTags([...projectTags, tag]);
    }
  };

  return (
    <ProjectContext.Provider value={{
      selectedProject,
      setSelectedProject,
      projectTags,
      addProjectTag
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
