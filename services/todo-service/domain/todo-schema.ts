import { Static, Type } from '@sinclair/typebox';

export const todoSchema = Type.Object({
  id: Type.Integer(),
  userId: Type.Integer(),
  title: Type.String(),
  status: Type.String(),
});

export const addTodoSchema = Type.Omit(todoSchema, ['id']);

export type addTodoDTO = Static<typeof addTodoSchema>;

export type updateTodoDTO = Static<typeof todoSchema>;
