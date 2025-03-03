import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { addUserDTO, addUserSchema } from '../user-schema';
import { isValidEmail } from './email-validation';
import { isStrongPassword } from './password-validation';

export function assertNewUserIsValid(newUserRequest: addUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addUserDTO> | undefined;
  validationSchema = ajv.getSchema<addUserDTO>('new-user');
  if (!validationSchema) {
    ajv.addSchema(addUserSchema, 'new-user');
    validationSchema = ajv.getSchema<addUserDTO>('new-user');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }

  const isValid =
    validationSchema(newUserRequest) &&
    isStrongPassword(newUserRequest.password) &&
    isValidEmail(newUserRequest.email);

  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, false);
  }
}
