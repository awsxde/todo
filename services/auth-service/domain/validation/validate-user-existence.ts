import { AppError } from '@practica/error-handling';
import { getUserByEmail } from '../../data-access/user-repository';

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
