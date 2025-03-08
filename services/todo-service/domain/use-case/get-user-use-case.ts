import * as todoRepository from '../../data-access/todo-repository';
import { throwIfIdNotExists } from '../validation/validate-todo-existence';

export async function getTodo(todoId: number) {
  await throwIfIdNotExists(todoId);
  const response = await todoRepository.getTodoById(todoId);
  return response;
}
