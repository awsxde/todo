import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { addTodoSchema, updateTodoDTO } from '../todo-schema';

export function assertUpdateTodoIsValid(updateTodoRequest: updateTodoDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<updateTodoDTO> | undefined;
  validationSchema = ajv.getSchema<updateTodoDTO>('update-todo');
  if (!validationSchema) {
    ajv.addSchema(addTodoSchema, 'update-todo');
    validationSchema = ajv.getSchema<updateTodoDTO>('update-todo');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }

  const isValid = validationSchema(updateTodoRequest);

  if (!isValid) {
    throw new AppError('invalid-todo', `Validation failed`, 400, false);
  }
}
