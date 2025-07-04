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
