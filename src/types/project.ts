
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
  stories: string[];
}

export interface Story {
  id: string;
  epicId: string;
  name: string;
  description: string;
  tasks: string[];
}

export interface Task {
  id: string;
  projectId?: string;
  storyId?: string;
  name: string;
  description: string;
  type: 'epic' | 'story' | 'task' | 'sub-task' | 'issue';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  storyPoints: number;
  assigneeId: string;
  reporterId: string;
  likes: number;
  comments: number;
  createdAt: string;
  labels: string[];
  attachments: string[];
  subTasks: string[];
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
