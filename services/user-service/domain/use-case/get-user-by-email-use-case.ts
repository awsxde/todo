import * as userRepository from '../../data-access/user-repository';
import { throwIfEmailNotExists } from '../validation/validate-user-existence';

export async function getUserByEmail(email: string) {
  await throwIfEmailNotExists(email);
  const response = await userRepository.getUserByEmail(email);
  return response;
}
