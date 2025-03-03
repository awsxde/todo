import * as userRepository from '../../data-access/user-repository';
import { throwIfIdNotExists } from '../validation/validate-user-existence';

export async function deleteUser(userId: number) {
  await throwIfIdNotExists(userId);
  return await userRepository.deleteUser(userId);
}
