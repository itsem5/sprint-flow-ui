
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdById: string;
  createdAt: string;
  status?: 'active' | 'inactive' | 'completed';
  members?: string[];
  successCriteria?: string[];
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
  ticketId: string; // e.g., "TASK-34", "BUG-46"
  projectId?: string;
  storyId?: string;
  parentTaskId?: string; // For sub-tasks and bugs linked to tasks
  name: string;
  description: string;
  type: 'epic' | 'story' | 'task' | 'sub-task' | 'bug' | 'issue';
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
  relatedTickets: string[]; // IDs of related tickets
}

export interface SubTask {
  id: string;
  ticketId: string;
  taskId: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  order: number;
}
