import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { getMe } from './api/auth.api';
import useAuthStore from './store/auth.store';
import router from './router';
import './index.css';

async function initAuth() {
  try {
    const data = await getMe();
    useAuthStore.getState().setAuth(data.user);
  } catch {
    useAuthStore.getState().clearAuth();
  }
}

initAuth().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
