import * as userRepository from '../../data-access/user-repository';
import { addUserDTO } from '../user-schema';
import { assertNewUserIsValid } from '../validation/add-user-validators';
import { throwIfEmailExists } from '../validation/validate-user-existence';

export async function addUser(newUser: addUserDTO) {
  assertNewUserIsValid(newUser);
  await throwIfEmailExists(newUser.email);
  const finalUserToSave = { ...newUser };
  const response = await userRepository.addUser(finalUserToSave);

  return response;
}
