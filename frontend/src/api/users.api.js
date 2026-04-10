import { apiClient } from './client';

export function getUsers(page, limit) {
  return apiClient.get(`/api/users?page=${page}&limit=${limit}`);
}

export function getUser(id) {
  return apiClient.get(`/api/users/${id}`);
}

export function createUser(data) {
  return apiClient.post('/api/users', data);
}

export function updateUser(id, data) {
  return apiClient.put(`/api/users/${id}`, data);
}

export function deleteUser(id) {
  return apiClient.delete(`/api/users/${id}`);
}
