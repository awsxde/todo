import { AppError } from '@practica/error-handling';
import { getTodoById } from '../../data-access/todo-repository';

export async function throwIfIdNotExists(id: number) {
  const todo = await getTodoById(id);
  if (!todo) {
    throw new AppError(
      'todo-does-not-exist',
      `The todo with id ${id} does not exist`,
      404,
      false
    );
  }
}
