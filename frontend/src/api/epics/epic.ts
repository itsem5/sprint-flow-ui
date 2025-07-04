import { api } from '../../utils/api';

interface CreateEpicPayload {
  projectId: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  createdBy: number;
  assignedTo?: string;
  tags?: string[];
  startDate?: string;
  dueDate?: string;
}

export const createEpic = async (epicData: CreateEpicPayload) => {
  const response = await api.post('/epics', epicData);
  return response.data;
};

export const getAllEpics = async () => {
  const response = await api.get('/epics');
  return response.data;
};
