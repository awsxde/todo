import { getPrismaClient } from './prisma-client-factory';

// ️️️✅ Best Practice: The repository pattern - Wrap the entire DB layer with a simple interface that returns plain JS objects
export async function getUserByEmail(email: string) {
  const resultUser = await getPrismaClient().user.findUnique({
    where: {
      email,
    },
  });

  return resultUser;
}
