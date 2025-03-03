import { AppError } from '@practica/error-handling';
import bcrypt from 'bcrypt';

export async function verifyPasswordOrThrow(
  plainPassword: string,
  hashedPassword: string
) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  if (!isMatch) {
    throw new AppError('invalid-password', 'Invalid password', 400, false);
  }
}
