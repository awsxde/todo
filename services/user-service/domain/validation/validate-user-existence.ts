import { AppError } from '@practica/error-handling';
import { getUserByEmail, getUserById } from '../../data-access/user-repository';

export async function throwIfEmailExists(email: string) {
  const user = await getUserByEmail(email);
  if (user) {
    throw new AppError(
      'user-already-exists',
      `The user with email ${email} already exists`,
      400,
      false
    );
  }
}

export async function throwIfEmailNotExists(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError(
      'user-does-not-exists',
      `The user with email ${email} does not exists`,
      400,
      false
    );
  }
}

export async function throwIfIdNotExists(id: number) {
  const user = await getUserById(id);
  if (!user) {
    throw new AppError(
      'user-does-not-exist',
      `The user with id ${id} does not exist`,
      404,
      false
    );
  }
}
