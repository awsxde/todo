import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { addUserSchema, updateUserDTO } from '../user-schema';
import { isValidEmail } from './email-validation';
import { isStrongPassword } from './password-validation';

export function assertUpdateUserIsValid(updateUserRequest: updateUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<updateUserDTO> | undefined;
  validationSchema = ajv.getSchema<updateUserDTO>('update-user');
  if (!validationSchema) {
    ajv.addSchema(addUserSchema, 'update-user');
    validationSchema = ajv.getSchema<updateUserDTO>('update-user');
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
    validationSchema(updateUserRequest) &&
    isStrongPassword(updateUserRequest.password) &&
    isValidEmail(updateUserRequest.email);

  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, false);
  }
}
