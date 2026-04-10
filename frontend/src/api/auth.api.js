import { apiClient } from './client';

export function login(email, password) {
  return apiClient.post('/api/auth/login', { email, password });
}

export function register(data) {
  return apiClient.post('/api/auth/register', data);
}

export function logout() {
  return apiClient.post('/api/auth/logout');
}

export function getMe() {
  return apiClient.get('/api/auth/me');
}
