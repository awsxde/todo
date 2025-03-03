import { Static, Type } from '@sinclair/typebox';

export const userSchema = Type.Object({
  id: Type.Integer(),
  email: Type.String(),
  password: Type.String(),
});

export const addUserSchema = Type.Omit(userSchema, ['id']);

export type addUserDTO = Static<typeof addUserSchema>;

export type updateUserDTO = Static<typeof userSchema>;
