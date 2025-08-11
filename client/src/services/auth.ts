import api from './api';
import type { User, AuthResponse } from '../types';

interface LoginResponse {
  token: string;
  vendor: User; // Matches server response
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  
  return {
    token: response.data.token,
    user: response.data.vendor // Map 'vendor' to 'user' for client
  };
};

export const register = async (userData: {
  email: string;
  password: string;
  kraPin: string;
  companyName: string;
  phoneNumber: string;
  category: 'goods' | 'services';
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};