import { hashPassword } from '@/common/utils/auth';
import { UserEntity, UserRole } from '@/database/entity/user.entity';

export const userRepository = {
  createUserSeller: async ({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email: string;
  }): Promise<boolean | null> => {
    try {
      const hashedPassword = await hashPassword(password);
      await UserEntity.create({
        name,
        password: hashedPassword,
        email,
        role: UserRole.SELLER,
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
          role: UserRole.SELLER,
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
