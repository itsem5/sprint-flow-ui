
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

import { API_BASE_URL } from '../../utils/api';

import { Project } from "@/types/project";

interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: string;
  members?: string[];
  successCriteria?: string[];
}

interface UpdateProjectPayload {
  id: string;
  name?: string;
  description?: string;
  status?: string;
}

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectData: CreateProjectPayload) => {
      if (!user || !user.id) {
        throw new Error("User not authenticated or user ID not available.");
      }
      const newProjectId = uuidv4(); // Generate a unique ID for the project
      const payload = { ...projectData, id: newProjectId, createdById: user.id.toString() };
      const response = await axios.post(`${API_BASE_URL}/projects`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useGetProjects = () => {
  return useQuery<Project[]>({ 
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/projects`);
      return response.data;
    },
  });
};

export const useGetProject = (id: string) => {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if id is truthy
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData: UpdateProjectPayload) => {
      const { id, ...data } = projectData;
      const response = await axios.put(`${API_BASE_URL}/projects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
