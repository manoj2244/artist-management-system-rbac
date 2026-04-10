import { apiClient } from './client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function getArtists(page, limit) {
  return apiClient.get(`/api/artists?page=${page}&limit=${limit}`);
}

export function getArtist(id) {
  return apiClient.get(`/api/artists/${id}`);
}

export function createArtist(data) {
  return apiClient.post('/api/artists', data);
}

export function updateArtist(id, data) {
  return apiClient.put(`/api/artists/${id}`, data);
}

export function deleteArtist(id) {
  return apiClient.delete(`/api/artists/${id}`);
}

export async function exportArtistsCSV() {
  const response = await fetch(`${BASE_URL}/api/artists/export.csv`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Export failed');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'artists.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importArtistsCSV(file) {
  const text = await file.text();
  const response = await fetch(`${BASE_URL}/api/artists/import.csv`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'text/csv' },
    body: text
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Import failed');
    error.details = data.details;
    throw error;
  }
  return data;
}
