import * as todoRepository from '../../data-access/todo-repository';
import { throwIfIdNotExists } from '../validation/validate-todo-existence';

export async function deleteTodo(todoId: number) {
  await throwIfIdNotExists(todoId);
  return await todoRepository.deleteTodo(todoId);
}
