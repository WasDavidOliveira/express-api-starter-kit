import { roles } from '@/db/schema/v1/role.schema';
import { db } from '@/db/db.connection';
import { eq } from 'drizzle-orm';
import { CreateRoleModel, RoleModel } from '@/types/models/v1/role.types';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';

class RoleRepository {
  async create(roleData: CreateRoleModel): Promise<RoleModel> {
    const [newRole] = await db.insert(roles).values(roleData).returning();

    return newRole;
  }

  async update(id: number, roleData: CreateRoleModel): Promise<RoleModel> {
    const [updatedRole] = await db
      .update(roles)
      .set(roleData)
      .where(eq(roles.id, id))
      .returning();

    return updatedRole;
  }

  async findById(id: number): Promise<RoleModel | null> {
    const roleResults = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    return roleResults[0] || null;
  }

  async findAll(): Promise<RoleModel[]> {
    const roleResults = await db.select().from(roles);

    return roleResults;
  }

  async delete(id: number): Promise<void> {
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    await db.delete(roles).where(eq(roles.id, id));
  }
}

export default new RoleRepository();
