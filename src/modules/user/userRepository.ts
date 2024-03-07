import { Op } from 'sequelize';

import { hashPassword } from '@/common/utils/auth';
import { UserEntity, UserRole } from '@/database/entity/user.entity';

export const userRepository = {
  createUserSeller: async ({
    name,
    password,
    email,
    role,
  }: {
    name: string;
    password: string;
    email: string;
    role: UserRole;
  }): Promise<boolean | null> => {
    try {
      const hashedPassword = await hashPassword(password);
      await UserEntity.create({
        name,
        password: hashedPassword,
        email,
        role,
      });
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },
  getUserByEmail: async (email: string): Promise<UserEntity | null> => {
    try {
      const user = await UserEntity.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          email: email,
        },
      });
      return user || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },
  getAllSellers: async (): Promise<UserEntity[] | null> => {
    try {
      const sellers = await UserEntity.findAll({
        where: {
          [Op.or]: [{ role: UserRole.SELLER }, { role: UserRole.ADMIN }],
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'role'],
        },
      });
      return sellers;
    } catch (error) {
      console.error('Error getting sellers:', error);
      return null;
    }
  },
  getUserById: async (userId: number): Promise<UserEntity | null> => {
    try {
      return await UserEntity.findByPk(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
};
