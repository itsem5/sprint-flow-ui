
import { useState, useEffect } from 'react';
import staticData from '../data/staticData.json';
import { Project, Epic, Story, Task, SubTask } from '../types/project';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string | null;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TaskWithDetails extends Omit<Task, 'attachments' | 'subTasks'> {
  ticketId: string;
  assignee: User;
  reporter: User;
  attachments: Attachment[];
  subTasks: SubTask[];
  relatedTickets: string[];
}

export interface StoryWithDetails extends Omit<Story, 'tasks'> {
  tasks: TaskWithDetails[];
}

export interface EpicWithDetails extends Omit<Epic, 'stories'> {
  stories: StoryWithDetails[];
}

export interface ProjectWithDetails extends Project {
  epics: EpicWithDetails[];
}

export const useStaticData = () => {
  const [data, setData] = useState<{
    users: User[];
    projects: ProjectWithDetails[];
    epics: EpicWithDetails[];
    stories: StoryWithDetails[];
    tasks: TaskWithDetails[];
    subTasks: SubTask[];
    attachments: Attachment[];
  } | null>(null);

  useEffect(() => {
    const processData = () => {
      const users = staticData.users as User[];
      const attachments = staticData.attachments as Attachment[];
      const subTasks = staticData.subTasks as SubTask[];
      
      // Process tasks with user and attachment details
      const tasks: TaskWithDetails[] = staticData.tasks.map((task, index) => {
        const assignee = users.find(u => u.id === task.assigneeId);
        const reporter = users.find(u => u.id === task.reporterId);
        const taskAttachments = attachments.filter(a => task.attachments.includes(a.id));
        const taskSubTasks = subTasks.filter(st => task.subTasks.includes(st.id));

        // Generate ticket ID based on type and index
        const typePrefix = task.type.toUpperCase().replace('-', '');
        const ticketId = `${typePrefix}-${(index + 1).toString().padStart(3, '0')}`;

        return {
          ...task,
          ticketId,
          type: task.type as 'epic' | 'story' | 'task' | 'sub-task' | 'bug' | 'issue',
          status: task.status as 'todo' | 'in-progress' | 'review' | 'done',
          priority: task.priority as 'low' | 'medium' | 'high' | 'urgent',
          assignee: assignee || users[0],
          reporter: reporter || users[0],
          attachments: taskAttachments,
          subTasks: taskSubTasks,
          relatedTickets: (task as any).relatedTickets || []
        };
      });

      // Process stories with task details
      const stories: StoryWithDetails[] = staticData.stories.map(story => ({
        ...story,
        tasks: tasks.filter(t => story.tasks.includes(t.id))
      }));

      // Process epics with story details
      const epics: EpicWithDetails[] = staticData.epics.map(epic => ({
        ...epic,
        stories: stories.filter(s => epic.stories.includes(s.id))
      }));

      // Process projects with epic details
      const projects: ProjectWithDetails[] = staticData.projects.map(project => ({
        ...project,
        status: project.status as 'active' | 'inactive' | 'completed',
        ticketCounter: (project as any).ticketCounter || {
          story: 0,
          task: 0,
          'sub-task': 0,
          bug: 0,
          issue: 0
        },
        epics: epics.filter(e => e.projectId === project.id)
      }));

      setData({
        users,
        projects,
        epics,
        stories,
        tasks,
        subTasks,
        attachments
      });
    };

    processData();
  }, []);

  return data;
};
