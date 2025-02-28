import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import {
  addUserDTO,
  addUserSchema,
  loginUserDTO,
  updateUserDTO,
} from './user-schema';

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
  const isValid = validationSchema(newUserRequest);
  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, true);
  }
}

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
  const isValid = validationSchema(updateUserRequest);
  if (!isValid) {
    throw new AppError('invalid-user', `Validation failed`, 400, true);
  }
}

export function assertLoginUserIsValid(credentials: loginUserDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<loginUserDTO> | undefined;
  validationSchema = ajv.getSchema<loginUserDTO>('login-user');
  if (!validationSchema) {
    ajv.addSchema(addUserSchema, 'login-user');
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
  const isValid = validationSchema(credentials);
  if (!isValid) {
    throw new AppError('invalid-password', `Validation failed`, 400, true);
  }
}
