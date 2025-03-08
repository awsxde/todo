import { AppError } from '@practica/error-handling';
import axios from 'axios';

export async function throwIfUserNotExists(userId: number) {
  const userVerificationRequest = await axios.get(
    `http://localhost:3010/user/${userId}`,
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
}
