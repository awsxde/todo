import { AppError } from '@practica/error-handling';
import axios from 'axios';

export async function assertUserExists(userId: number) {
  const userVerificationRequest = await axios.get(
    `http://localhost/user/${userId}`,
    {
      validateStatus: () => true,
    }
  );
  if (userVerificationRequest.status !== 200) {
    throw new AppError(
      'user-does-not-exist',
      `The user ${userId} does not exist`,
      userVerificationRequest.status,
      true
    );
  }

  return userVerificationRequest.data;
}
