import { db } from '@/db/db.connection';
import { roles } from '@/db/schema/v1/role.schema';
import { userRoles } from '@/db/schema/v1/user-role.schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/utils/core/logger.utils';

export async function seedUserRoles() {
  try {
    logger.info('Seeding user roles...');

    const adminRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'admin'),
    });

    const userRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'user'),
    });

    if (!adminRole || !userRole) {
      throw new Error('Required roles not found. Please run role seeds first.');
    }

    const allUsers = await db.query.user.findMany();
    if (allUsers.length === 0) {
      logger.info('No users found to assign roles to.');
      return;
    }

    for (const userRecord of allUsers) {
      const roleToAssign = userRecord.email === 'admin@example.com' ? adminRole : userRole;
      
      const existing = await db
        .select()
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, userRecord.id),
            eq(userRoles.roleId, roleToAssign.id)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        await db
          .insert(userRoles)
          .values({
            userId: userRecord.id,
            roleId: roleToAssign.id,
          });
        
        logger.info(`Assigned role "${roleToAssign.name}" to user "${userRecord.email}"`);
      }
    }

    logger.info('User roles seeded successfully');
  } catch (error) {
    logger.error('Error seeding user roles:', error);
    throw error;
  }
}

if (require.main === module) {
  seedUserRoles()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Failed to seed user roles:', error);
      process.exit(1);
    });
} 