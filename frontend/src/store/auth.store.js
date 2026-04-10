import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,

  setAuth: (user) => set({
    user,
    role: user.role,
    isAuthenticated: true
  }),

  clearAuth: () => set({
    user: null,
    role: null,
    isAuthenticated: false
  })
}));

export default useAuthStore;
