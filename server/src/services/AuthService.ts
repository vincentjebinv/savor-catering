import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthService {
  static async register(data: any) {
    const validatedData = registerSchema.parse(data);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        companyName: validatedData.companyName,
      },
    });

    return { id: user.id, email: user.email };
  }

  static async login(data: any) {
    const validatedData = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !(await bcrypt.compare(validatedData.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
