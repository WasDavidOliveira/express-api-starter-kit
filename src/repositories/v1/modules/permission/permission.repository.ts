import { permissions } from '@/db/schema/v1/permission.schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import {
  CreatePermissionModel,
  PermissionModel,
} from '@/types/models/v1/permission.types';

class PermissionRepository {
  async create(
    permissionData: CreatePermissionModel,
  ): Promise<PermissionModel> {
    const [newPermission] = await db
      .insert(permissions)
      .values(permissionData)
      .returning();

    return newPermission;
  }

  async update(
    id: number,
    permissionData: CreatePermissionModel,
  ): Promise<PermissionModel> {
    const [updatedPermission] = await db
      .update(permissions)
      .set(permissionData)
      .where(eq(permissions.id, id))
      .returning();

    return updatedPermission;
  }

  async findById(id: number): Promise<PermissionModel | null> {
    const permissionResults = await db
      .select()
      .from(permissions)
      .where(eq(permissions.id, id))
      .limit(1);

    return permissionResults[0] ?? null;
  }

  async findAll(): Promise<PermissionModel[]> {
    const permissionResults = await db.select().from(permissions);

    return permissionResults;
  }

  async delete(id: number): Promise<void> {
    await db.delete(permissions).where(eq(permissions.id, id));
  }
}

export default new PermissionRepository();
