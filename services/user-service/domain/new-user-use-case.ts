import { AppError } from '@practica/error-handling';
import * as userRepository from '../data-access/user-repository';
import { signValidToken } from './sign-token';
import { addUserDTO, loginUserDTO, updateUserDTO } from './user-schema';
import {
  assertLoginUserIsValid,
  assertNewUserIsValid,
  assertUpdateUserIsValid,
} from './user-validators';

// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module
export async function addUser(newUser: addUserDTO) {
  assertNewUserIsValid(newUser);
  const finalUserToSave = { ...newUser };
  const response = await userRepository.addUser(finalUserToSave);

  return response;
}

export async function updateUser(user: updateUserDTO) {
  assertUpdateUserIsValid(user);
  // const userWhoUpdated = await assertUserExists(user.id);
  const finalUserToSave = { ...user };
  const response = await userRepository.updateUser(finalUserToSave);

  return response;
}

export async function loginUser(credentials: loginUserDTO) {
  assertLoginUserIsValid(credentials);
  // const userWhoLoggedIn = await assertUserExists(credentials.email);
  const user = await userRepository.getUserByEmail(credentials.email);
  const isPasswordValid = credentials.password === user!.password;

  if (!isPasswordValid) {
    throw new AppError('invalid-password', `invalid password`, 401, false);
  }

  const token = signValidToken(user, 'user');

  return token;
}

export async function deleteUser(userId) {
  return await userRepository.deleteUser(userId);
}

export async function getUser(userId) {
  const response = await userRepository.getUserById(userId);
  return response;
}

export async function getUsers() {
  const response = await userRepository.getUsers();
  return response;
}
