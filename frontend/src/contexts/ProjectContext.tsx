
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    try {
      const storedProject = localStorage.getItem('selectedProject');
      return storedProject ? JSON.parse(storedProject) : null;
    } catch (error) {
      console.error("Failed to parse selected project from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedProject) {
        localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
      } else {
        localStorage.removeItem('selectedProject');
      }
    } catch (error) {
      console.error("Failed to save selected project to localStorage", error);
    }
  }, [selectedProject]);

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
