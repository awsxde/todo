import * as userRepository from '../../data-access/user-repository';
import { loginUserDTO } from '../user-schema';
import { assertLoginUserIsValid } from '../validation/login-user-validators';
import { verifyPasswordOrThrow } from '../validation/password-validation';
import { throwIfEmailNotExists } from '../validation/validate-user-existence';
import { signValidToken } from './sign-token';

export async function loginUser(credentials: loginUserDTO) {
  assertLoginUserIsValid(credentials);
  await throwIfEmailNotExists(credentials.email);
  const user = await userRepository.getUserByEmail(credentials.email);

  verifyPasswordOrThrow(credentials.password, user!.password);

  const token = signValidToken(user, 'user');

  return token;
}
