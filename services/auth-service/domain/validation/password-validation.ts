import { AppError } from '@practica/error-handling';

export function throwIfPasswordIncorrect(
  password: string,
  hashedPassword: string
) {
  const isPasswordCorrect = password === hashedPassword;

  if (!isPasswordCorrect) {
    throw new AppError('invalid-password', `invalid password`, 400, false);
  }
}
