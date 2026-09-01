import { create } from 'zustand';
import { authApi } from '../api/auth';
import { disconnectSocket } from '../api/socket';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('elmkusoma_token') || null,
  isLoading: true,

  async login(credentials) {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('elmkusoma_token', data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },

  async register(payload) {
    const { data } = await authApi.register(payload);
    localStorage.setItem('elmkusoma_token', data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('elmkusoma_token');
      disconnectSocket();
      set({ user: null, token: null });
    }
  },

  // Called once on app boot to restore the session from a stored token.
  async fetchCurrentUser() {
    const token = get().token;
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { data } = await authApi.me();
      set({ user: data.user, isLoading: false });
    } catch {
      localStorage.removeItem('elmkusoma_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  hasRole(...roles) {
    return roles.includes(get().user?.role);
  },
}));

export default useAuthStore;
