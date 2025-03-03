import { faker } from '@faker-js/faker/locale/en';
import jwt from 'jsonwebtoken';

export function signValidTokenWithDefaultUser() {
  return internalSignTokenSynchronously(
    'joe',
    'admin',
    Date.now() + 60 * 60 * 60 * 100000
  );
}

function internalSignTokenSynchronously(user, roles, expirationInUnixTime) {
  const token = jwt.sign(
    {
      exp: expirationInUnixTime,
      data: {
        user,
        roles,
      },
    },
    exampleSecret
  );

  return token;
}

export const exampleSecret = 'just-a-default-secret';

// Helper function to generate a valid email
export function generateValidEmail() {
  return faker.internet.email();
}
