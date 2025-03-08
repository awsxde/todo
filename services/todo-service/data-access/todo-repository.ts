import { getPrismaClient } from './prisma-client-factory';

// ️️️✅ Best Practice: The repository pattern - This is a plain JS object (POJO) that is returned to the domain layer
// This way, the domain/business-logic can focus on its business and avoid delving into DB/ORM narratives
type TodoRecord = {
  id: number;
  userId: number;
  title: string;
  status: string;
};

// ️️️✅ Best Practice: The repository pattern - Wrap the entire DB layer with a simple interface that returns plain JS objects
export async function addTodo(newTodoRequest: Omit<TodoRecord, 'id'>) {
  const resultTodo = await getPrismaClient().todo.create({
    data: { ...newTodoRequest },
  });

  return resultTodo;
}

export async function updateTodo(updateTodoRequest: TodoRecord) {
  const resultTodo = await getPrismaClient().todo.update({
    where: { id: updateTodoRequest.id },
    data: { ...updateTodoRequest },
  });

  return resultTodo;
}

export async function getTodoById(id: number) {
  const resultTodo = await getPrismaClient().todo.findUnique({
    where: {
      id,
    },
  });

  return resultTodo;
}

export async function deleteTodo(todoIdToDelete: number) {
  const deleteResult = await getPrismaClient().todo.delete({
    where: {
      id: todoIdToDelete,
    },
  });
  return deleteResult;
}
