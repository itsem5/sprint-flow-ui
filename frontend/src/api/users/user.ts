import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await api.get(`/users/search/${query}`);
  return response.data;
};

export const useSearchUsersInOrganization = (organizationId: number, userName: string) => {
  return useQuery<User[]>({
    queryKey: ['users', organizationId, userName],
    queryFn: async () => {
      if (!userName) {
        return [];
      }
      const response = await api.get(`/users/search/${organizationId}/${userName}`);
      return response.data;
    },
    enabled: !!organizationId && !!userName,
  });
};
