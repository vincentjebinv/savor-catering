import bcrypt from 'bcryptjs';

// 🔒 Encrypt a password before saving to DB
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Hashing failed", error);
    throw new Error("Security Error: Could not hash password");
  }
};

// 🔓 Check if entered password matches the saved hash
export const verifyPassword = async (inputPassword: string, storedHash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(inputPassword, storedHash);
  } catch (error) {
    console.error("Verification failed", error);
    return false;
  }
};