import { Static, Type } from '@sinclair/typebox';

export const userSchema = Type.Object({
  id: Type.Integer(),
  email: Type.String(),
  password: Type.String(),
});

export const loginUserSchema = Type.Omit(userSchema, ['id']);

export type loginUserDTO = Static<typeof loginUserSchema>;
