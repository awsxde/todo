import * as todoRepository from '../data-access/todo-repository';
import paymentTermsService from './payment-terms-service';
import { assertNewTodoIsValid } from './todo-validators';
import { assertUserExists } from './user-service-client';
import { addTodoDTO } from './todo-schema';

// ️️️✅ Best Practice: Start a flow with a 'use case' function that summarizes the flow in high-level
// It should merely tell the feature story without too much information. Kind of a 'yellow pages' of the module
export async function addTodo(newTodo: addTodoDTO) {
  assertNewTodoIsValid(newTodo);
  const userWhoAddedTodo = await assertUserExists(newTodo.userId);
  const finalTodoToSave = { ...newTodo };
  const response = await todoRepository.addTodo(finalTodoToSave);

  return response;
}

export async function deleteTodo(userId) {
  return await todoRepository.deleteTodo(userId);
}

export async function getTodo(userId) {
  const response = await todoRepository.getTodoById(userId);
  return response;
}
