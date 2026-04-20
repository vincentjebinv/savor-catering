import { Preferences } from '@capacitor/preferences';

const KEY_USER_ID = 'solai_active_user_id';
const KEY_USER_EMAIL = 'solai_active_user_email';

// 💾 Save Session (Run this after successful login)
export const startSession = async (userId: number, email: string) => {
  await Preferences.set({ key: KEY_USER_ID, value: userId.toString() });
  await Preferences.set({ key: KEY_USER_EMAIL, value: email });
};

// 🔍 Get Current User ID (Used by Menu/Orders to filter data)
export const getSessionUserId = async (): Promise<number | null> => {
  const { value } = await Preferences.get({ key: KEY_USER_ID });
  return value ? parseInt(value) : null;
};

// 📧 Get Current User Email (For display)
export const getSessionUserEmail = async (): Promise<string | null> => {
  const { value } = await Preferences.get({ key: KEY_USER_EMAIL });
  return value || null;
};

// 🚪 Clear Session (Logout)
export const clearSession = async () => {
  await Preferences.remove({ key: KEY_USER_ID });
  await Preferences.remove({ key: KEY_USER_EMAIL });
};

// ❓ Check if anyone is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: KEY_USER_ID });
  return !!value; // Returns true if value exists, false if null
};