import { AppError } from '@practica/error-handling';
import ajv from '@practica/validation';
import { ValidateFunction } from 'ajv';
import { todoSchema, addTodoDTO } from './todo-schema';

export function assertNewTodoIsValid(newTodoRequest: addTodoDTO) {
  // Since compiling a validation schema is expensive, we always try to use the cached version first
  let validationSchema!: ValidateFunction<addTodoDTO> | undefined;
  validationSchema = ajv.getSchema<addTodoDTO>('new-todo');
  if (!validationSchema) {
    ajv.addSchema(todoSchema, 'new-todo');
    validationSchema = ajv.getSchema<addTodoDTO>('new-todo');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      'unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }
  const isValid = validationSchema(newTodoRequest);
  if (!isValid) {
    throw new AppError('invalid-todo', `Validation failed`, 400, true);
  }
}
