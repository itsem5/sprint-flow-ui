import { api } from '../../utils/api';

export interface Epic {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  assigneeUser: { firstName: string; lastName: string };
  assignedToUser: { firstName: string; lastName: string };
  creator: { firstName: string; lastName: string };
  tags: string[];
  startDate: string;
  dueDate: string;
  project: { name: string };
}

interface CreateEpicPayload {
  projectId: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  createdById: number;
  assignee?: number;
  assignedTo?: number;
  tags?: string[];
  startDate?: string;
  dueDate?: string;
}

export const createEpic = async (epicData: CreateEpicPayload) => {
  const response = await api.post('/epics', epicData);
  return response.data;
};

export const getAllEpics = async (projectId: string) => {
  const response = await api.get(`/epics?projectId=${projectId}`);
  return response.data;
};

export const updateEpic = async (id: string, epicData: Partial<Epic>) => {
  const response = await api.patch(`/epics/${id}`, epicData);
  return response.data;
};

export const deleteEpic = async (id: string) => {
  const response = await api.delete(`/epics/${id}`);
  return response.data;
};
