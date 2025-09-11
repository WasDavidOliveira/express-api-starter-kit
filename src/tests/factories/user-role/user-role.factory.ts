import { db } from '@/db/db.connection';
import { userRoles } from '@/db/schema/v1/user-role.schema';
import { UserRole } from '@/types/infrastructure/middlewares.types';
import { eq, and } from 'drizzle-orm';

export class UserRoleFactory {
  static async attachRoleToUser(
    userId: number,
    roleId: number,
  ): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({
        userId,
        roleId,
      })
      .returning();

    return {
      userId: userRole.userId,
      roleId: userRole.roleId,
      createdAt: userRole.createdAt,
      updatedAt: userRole.updatedAt,
    };
  }

  static async createUserWithRole(
    userId: number,
    roleId: number,
  ): Promise<UserRole> {
    return this.attachRoleToUser(userId, roleId);
  }

  static async detachRoleFromUser(
    userId: number,
    roleId: number,
  ): Promise<void> {
    await db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
  }
}
