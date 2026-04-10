import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  artistId: null,
  isAuthenticated: false,

  setAuth: (user) => set({
    user,
    role: user.role,
    artistId: user.artist_id || null,
    isAuthenticated: true
  }),

  clearAuth: () => set({
    user: null,
    role: null,
    artistId: null,
    isAuthenticated: false
  })
}));

export default useAuthStore;
