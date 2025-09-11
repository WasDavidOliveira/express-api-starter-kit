import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import * as bcrypt from 'bcrypt';
import { logger } from '@/utils/core/logger.utils';

export async function seedUsers() {
  try {
    logger.info('Seeding users...');

    const saltRounds = 10;

    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', saltRounds),
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', saltRounds),
      },
    ];

    for (const userData of defaultUsers) {
      await db
        .insert(user)
        .values(userData)
        .onConflictDoNothing({ target: user.email });
    }

    logger.info('Users seeded successfully');
  } catch (error) {
    logger.error('Error seeding users:', error);

    throw error;
  }
}

if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to seed users:', error);
      process.exit(1);
    });
}
