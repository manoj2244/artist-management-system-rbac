import { apiClient } from './client';

export function getSongs(artistId, page, limit) {
  return apiClient.get(`/api/artists/${artistId}/songs?page=${page}&limit=${limit}`);
}

export function createSong(artistId, data) {
  return apiClient.post(`/api/artists/${artistId}/songs`, data);
}

export function updateSong(artistId, songId, data) {
  return apiClient.put(`/api/artists/${artistId}/songs/${songId}`, data);
}

export function deleteSong(artistId, songId) {
  return apiClient.delete(`/api/artists/${artistId}/songs/${songId}`);
}
