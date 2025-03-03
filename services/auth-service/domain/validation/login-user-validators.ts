import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { loginUserDTO, loginUserSchema } from '../user-schema';

export function assertLoginUserIsValid(loginUserRequest: loginUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<loginUserDTO> | undefined;
  validationSchema = ajv.getSchema<loginUserDTO>('login-user');
  if (!validationSchema) {
    ajv.addSchema(loginUserSchema, 'login-user');
    validationSchema = ajv.getSchema<loginUserDTO>('login-user');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }

  const isValid = validationSchema(loginUserRequest);

  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, false);
  }
}
