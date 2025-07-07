import { api } from '../../utils/api';

export interface Story {
  id: string;
  name: string;
  description: string;
  epicId: string;
  status: string;
  priority: string;
  assignee: { firstName: string; lastName: string };
  dueDate: string;
}

export const createStory = async (storyData: Omit<Story, 'id'>) => {
  const response = await api.post('/stories', storyData);
  return response.data;
};

export const getAllStories = async (projectId: string) => {
  const response = await api.get(`/stories?projectId=${projectId}`);
  return response.data;
};
