import * as userRepository from '../data-access/user-repository';

export async function assertUserExists(userId: number) {
  const userVerificationRequest = await userRepository.getUserById(userId);
  console.log(userVerificationRequest);
}
