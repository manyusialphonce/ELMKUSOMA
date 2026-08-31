import { create } from 'zustand';

import { authApi } from '../api/auth';
import { disconnectSocket } from '../api/socket';

const useAuthStore = create((set, get) => ({
  // ==============================
  // STATE
  // ==============================

  user: null,

  token: localStorage.getItem('elmkusoma_token') || null,

  isLoading: true,


  // ==============================
  // LOGIN
  // ==============================

  async login(credentials) {
    const { data } = await authApi.login(credentials);

    localStorage.setItem(
      'elmkusoma_token',
      data.token
    );

    set({
      user: data.user,
      token: data.token,
      isLoading: false,
    });

    return data.user;
  },


  // ==============================
  // REGISTER
  // ==============================

  async register(payload) {
    const { data } = await authApi.register(payload);

    localStorage.setItem(
      'elmkusoma_token',
      data.token
    );

    set({
      user: data.user,
      token: data.token,
      isLoading: false,
    });

    return data.user;
  },


  // ==============================
  // LOGOUT
  // ==============================

  async logout() {
    try {
      // Call backend logout only if it exists
      if (authApi.logout) {
        await authApi.logout();
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem(
        'elmkusoma_token'
      );

      disconnectSocket();

      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },


  // ==============================
  // RESTORE SESSION
  // ==============================

  async fetchCurrentUser() {
    const token = get().token;

    if (!token) {
      set({
        user: null,
        token: null,
        isLoading: false,
      });

      return;
    }

    try {
      const { data } = await authApi.me();

      set({
        user: data.user,
        isLoading: false,
      });

    } catch (error) {
      console.warn(
        'Failed to restore session:',
        error
      );

      localStorage.removeItem(
        'elmkusoma_token'
      );

      disconnectSocket();

      set({
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },


  // ==============================
  // ROLE CHECK
  // ==============================

  hasRole(...allowedRoles) {
    const user = get().user;

    if (!user) {
      return false;
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : user.role
        ? [user.role]
        : [];

    return userRoles.some((role) =>
      allowedRoles.includes(role)
    );
  },

}));

export default useAuthStore;