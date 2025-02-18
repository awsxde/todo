import { Static, Type } from '@sinclair/typebox';

export const todoSchema = Type.Object({
  id: Type.Integer(),
  userId: Type.Integer(),
  title: Type.String(),
  status: Type.String(),
});

export type addTodoDTO = Static<typeof todoSchema>;
