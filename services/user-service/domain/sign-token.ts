import jwt from 'jsonwebtoken';

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
    process.env.SECRET_KEY || 'just-a-default-secret'
  );

  return token;
}
