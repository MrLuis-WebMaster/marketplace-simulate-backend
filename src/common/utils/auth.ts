import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserEntity } from '@/database/entity/user.entity';

import { env } from './envConfig';

const secretKey = env.JWT_SECRET_KEY;
const tokenExpiration = env.JWT_EXPIRATION;

interface PayloadInterface {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function generateAuthToken(payload: PayloadInterface): string {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
}

interface DecodedToken extends UserEntity {
  exp: number;
}

export function readAuthToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Error reading auth token:', error);
    return null;
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(inputPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
};
