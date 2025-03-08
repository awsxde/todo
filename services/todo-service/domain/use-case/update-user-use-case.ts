import * as todoRepository from '../../data-access/todo-repository';
import { updateTodoDTO } from '../todo-schema';
import { assertUpdateTodoIsValid } from '../validation/update-todo-validators';
import { throwIfIdNotExists } from '../validation/validate-todo-existence';

export async function updateTodo(todo: updateTodoDTO) {
  assertUpdateTodoIsValid(todo);
  await throwIfIdNotExists(todo.id);

  const finalTodoToSave = { ...todo };
  const response = await todoRepository.updateTodo(finalTodoToSave);

  return response;
}
