import { user } from '@/db/schema/v1/user.schema';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import { ConflictError } from '@/utils/app-error.utils';

class UserRepository {
  async findById(id: number): Promise<UserModel | null> {
    const users = await db.select().from(user).where(eq(user.id, id)).limit(1);

    return users[0] || null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return users[0] || null;
  }

  async create(userData: CreateUserModel): Promise<UserModel> {
    try {
      const [newUser] = await db.insert(user).values(userData).returning();

      return newUser;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'detail' in error
      ) {
        const dbError = error as { code: string; detail: string };

        if (dbError.code === '23505') {
          if (dbError.detail.includes('email')) {
            throw new ConflictError('Email já está em uso');
          }

          throw new ConflictError('Recurso já existe');
        }
      }

      throw error;
    }
  }
}

export default new UserRepository();
