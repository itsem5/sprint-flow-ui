
export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  successCriteria: string[];
  status: 'active' | 'inactive' | 'completed';
  members: number;
  epicCount: number;
  storyCount: number;
  taskCount: number;
}

export interface Epic {
  id: string;
  projectId: string;
  name: string;
  description: string;
  stories: Story[];
}

export interface Story {
  id: string;
  epicId: string;
  name: string;
  description: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  storyId?: string;
  name: string;
  description: string;
  subTasks: SubTask[];
}

export interface SubTask {
  id: string;
  taskId: string;
  name: string;
  description: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  order: number;
}
