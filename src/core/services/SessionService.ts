export const isLoggedIn = async (): Promise<boolean> => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getSessionUserEmail = async (): Promise<string | null> => {
  return localStorage.getItem('userEmail');
};

export const getSessionUserId = async (): Promise<string | null> => {
  return localStorage.getItem('userId');
};

export const startSession = async (userId: string, email: string) => {
  localStorage.setItem('userId', userId);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isLoggedIn', 'true');
};

export const clearSession = async () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isLoggedIn');
};
