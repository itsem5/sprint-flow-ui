
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const useSignup = () => {
  return useMutation({
    mutationFn: (userData) => axios.post(`${API_URL}/users`, userData),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string }) => axios.post(`${API_URL}/users/login`, credentials),
  });
};
