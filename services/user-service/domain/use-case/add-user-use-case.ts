import bcrypt from 'bcrypt';
import * as userRepository from '../../data-access/user-repository';
import { addUserDTO } from '../user-schema';
import { assertNewUserIsValid } from '../validation/add-user-validators';
import { throwIfEmailExists } from '../validation/validate-user-existence';

export async function addUser(newUser: addUserDTO) {
  assertNewUserIsValid(newUser);
  await throwIfEmailExists(newUser.email);

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const finalUserToSave = { ...newUser, password: hashedPassword };
  const response = await userRepository.addUser(finalUserToSave);

  return response;
}
