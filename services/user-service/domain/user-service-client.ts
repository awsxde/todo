import { AppError } from '@practica/error-handling';
import { getUserByEmail, getUserById } from '../data-access/user-repository';

export async function assertEmailExists(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError(
      'user-does-not-exist',
      `The user with email ${email} does not exist`,
      404,
      false
    );
  }

  return user;
}

export async function assertEmailDoesNotExists(email: string) {
  const user = await getUserByEmail(email);

  if (user) {
    throw new AppError(
      'user-already-exists',
      `The user with email ${email} already exists`,
      400,
      false
    );
  }

  return user;
}

export async function assertIdExists(id: number) {
  const user = await getUserById(id);

  if (!user) {
    throw new AppError(
      'user-does-not-exist',
      `The user with id ${id} does not exist`,
      404,
      false
    );
  }

  return user;
}
