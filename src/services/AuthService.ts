import api from '../lib/api';
import { startSession, clearSession, isLoggedIn } from './SessionService';

export const AuthService = {
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      await startSession(data.user.id, data.user.email);
    }
    return data;
  },

  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    await clearSession();
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: async () => {
    return await isLoggedIn();
  },
};

// --- Backward Compatibility ---
export const loginUser = async (email: string, pass: string) => {
    try {
        const result = await AuthService.login({ email, password: pass });
        return { success: !!result.token, message: result.message };
    } catch (e: any) {
        return { success: false, message: e.response?.data?.message || e.message };
    }
};

export const registerUser = async (email: string, pass: string, company: string) => {
    try {
        await AuthService.register({ email, password: pass, companyName: company });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.response?.data?.message || e.message };
    }
};

export const logoutUser = () => AuthService.logout();
export const updateUserPassword = async (newPassword: string) => {
    // Placeholder for SaaS password update
    console.log("Password update requested for SaaS:", newPassword);
    return { success: true };
};