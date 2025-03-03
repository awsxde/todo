import * as userRepository from '../../data-access/user-repository';
import { throwIfIdNotExists } from '../validation/validate-user-existence';

export async function getUser(userId: number) {
  await throwIfIdNotExists(userId);
  const response = await userRepository.getUserById(userId);
  return response;
}

export async function getUsers() {
  const response = await userRepository.getUsers();
  return response;
}
