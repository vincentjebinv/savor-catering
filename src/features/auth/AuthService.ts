import { startSession, clearSession, isLoggedIn } from '../../core/services/SessionService';

export const AuthService = {
  login: async (credentials: any) => {
    const { email } = credentials;
    const sessionData = {
      id: "demo-user-id",
      email: email,
      companyName: 'Demo Catering'
    };

    localStorage.setItem('user_data', JSON.stringify(sessionData));
    await startSession(sessionData.id, sessionData.email);
    window.dispatchEvent(new Event('auth-change'));
    
    return { status: 'success', data: { user: sessionData } };
  },

  register: async (userData: any) => {
    const { email, companyName } = userData;
    return { id: "demo-user-id", email, companyName };
  },

  logout: async () => {
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('disclaimer_session_seen');
    await clearSession();
    window.dispatchEvent(new Event('auth-change'));
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: async () => {
    return await isLoggedIn();
  },
};

export const loginUser = async (email: string, pass: string) => {
    try {
        await AuthService.login({ email, password: pass });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const registerUser = async (email: string, pass: string, company: string) => {
    try {
        await AuthService.register({ email, password: pass, companyName: company });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const logoutUser = () => AuthService.logout();
export const updateUserPassword = async (_newPassword: string) => {
    return { success: true };
};