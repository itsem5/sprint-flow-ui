
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from "@/contexts/AuthContext";
import axios from 'axios';

import { API_BASE_URL } from '../../utils/api';

interface CreateOrganizationPayload {
  name: string;
  description?: string;
}

interface UpdateOrganizationPayload {
  id: number;
  name?: string;
  description?: string;
}

interface Organization {
  id: number;
  name: string;
  description?: string;
  createdById: number;
}

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (organizationData: CreateOrganizationPayload) => {
      if (!user || !user.id) {
        throw new Error("User not authenticated or user ID not available.");
      }
      const payload = { ...organizationData, createdById: user.id };
      const response = await axios.post(`${API_BASE_URL}/organizations`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useGetOrganization = (id?: number) => {
  return useQuery<Organization>({
    queryKey: ['organization', id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Organization ID is required.");
      }
      const response = await axios.get(`${API_BASE_URL}/organizations/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if id is truthy
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizationData: UpdateOrganizationPayload) => {
      const { id, ...data } = organizationData;
      const response = await axios.patch(`${API_BASE_URL}/organizations/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useSearchOrganizations = (name: string) => {
  return useQuery<Organization[]>({
    queryKey: ['organizations', name],
    queryFn: async () => {
      if (!name) {
        return [];
      }
      const response = await axios.get(`${API_BASE_URL}/organizations/search/${name}`);
      return response.data;
    },
    enabled: !!name,
  });
};

export const useAssignUserToOrganization = () => {
  const queryClient = useQueryClient();
  const { user, login } = useAuth();
  return useMutation({
    mutationFn: async (organizationId: number) => {
      if (!user || !user.id) {
        throw new Error("User not authenticated or user ID not available.");
      }
      const response = await axios.patch(`${API_BASE_URL}/organizations/${organizationId}/assign-user/${user.id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      login({ ...user, organization: data });
    },
  });
};
