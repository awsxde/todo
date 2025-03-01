import { faker } from '@faker-js/faker/locale/en';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const getAxiosInstance = (address) => {
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${address.port}`,
    Headers: {
      'content-type': 'application/json',
      authorization: 'Bearer...',
    },
  };

  return axios.create(axiosConfig);
};

export function signValidTokenWithDefaultUser() {
  return internalSignTokenSynchronously(
    'joe',
    'admin',
    Date.now() + 60 * 60 * 60 * 100000
  );
}

export function signValidToken(user, role) {
  return internalSignTokenSynchronously(user, role, Date.now() + 60 * 60);
}

export function signExpiredToken(user, role) {
  return internalSignTokenSynchronously(user, role, 0);
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
