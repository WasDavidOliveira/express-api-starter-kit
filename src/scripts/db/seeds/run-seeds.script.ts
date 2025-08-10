import { seedRoles } from '@/db/seeds/roles.seeds';
import { seedUsers } from '@/db/seeds/users.seeds';
import { seedPermissions } from '@/db/seeds/permissions.seeds';
import { seedRolePermissions } from '@/db/seeds/role-permissions.seeds';
import { seedUserRoles } from '@/db/seeds/user-roles.seeds';
import { logger } from '@/utils/core/logger.utils';

async function runAllSeeds() {
  try {
    logger.info('Starting database seeding...');

    await seedRoles();
    await seedUsers();
    await seedPermissions();
    await seedRolePermissions();
    await seedUserRoles();

    logger.info('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error running seeds:', error);
    process.exit(1);
  }
}

runAllSeeds();
