import { db } from '@/db/db.connection';
import { roles } from '@/db/schema/v1/role.schema';
import { logger } from '@/utils/core/logger.utils';

export async function seedRoles() {
  try {
    const defaultRoles = [
      {
        name: 'admin',
        description: 'Administrator with full system access',
      },
      {
        name: 'user',
        description: 'Regular user with standard permissions',
      },
      {
        name: 'guest',
        description: 'Limited access user',
      },
    ];

    logger.info('Seeding roles...');

    for (const role of defaultRoles) {
      await db
        .insert(roles)
        .values(role)
        .onConflictDoNothing({ target: roles.name });
    }

    logger.info('Roles seeded successfully');
  } catch (error) {
    logger.error('Error seeding roles:', error);
    throw error;
  }
}

if (require.main === module) {
  seedRoles()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed roles:', error);
      process.exit(1);
    });
}
