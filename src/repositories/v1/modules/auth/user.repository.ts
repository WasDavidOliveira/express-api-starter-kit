import { user } from '@/db/schema/v1/user.schema';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';

class UserRepository {
  async findById(id: number): Promise<UserModel | null> {
    const users = await db.select().from(user).where(eq(user.id, id)).limit(1);

    return users[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return users[0] ?? null;
  }

  async create(userData: CreateUserModel): Promise<UserModel> {
    const [newUser] = await db.insert(user).values(userData).returning();

    return newUser;
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await db
      .update(user)
      .set({ password: passwordHash })
      .where(eq(user.id, id));
  }
}

export default new UserRepository();
