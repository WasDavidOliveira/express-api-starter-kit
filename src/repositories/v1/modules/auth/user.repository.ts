import { user } from '@/db/schema/v1/user.schema';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import { BaseRepository } from '@/repositories/base.repository';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';

class UserRepository extends BaseRepository<UserModel, CreateUserModel> {
  protected table = user;
  protected idColumn = user.id;

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.findOneByCondition(eq(user.email, email));
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await db
      .update(user)
      .set({ password: passwordHash })
      .where(eq(user.id, id));
  }
}

export default new UserRepository();
