import * as todoRepository from '../../data-access/todo-repository';
import { addTodoDTO } from '../todo-schema';
import { assertNewTodoIsValid } from '../validation/add-todo-validators';

export async function addTodo(newTodo: addTodoDTO) {
  assertNewTodoIsValid(newTodo);
  // throwIfUserNotExists(newTodo.userId);

  const finalTodoToSave = { ...newTodo };
  const response = await todoRepository.addTodo(finalTodoToSave);

  return response;
}
