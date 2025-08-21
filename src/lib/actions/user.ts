"use server";

import { prisma } from "../prisma";

export const getAllUsersAction = async () => {
  const users = await prisma.user.findMany();
  console.log(users);
  return users;
};

export const getUserAction = async (id: number) => {
  const user = await prisma.user.findFirst({ where: { id } });
  console.log(user);
  return user;
};

export const addUserAction = async (username: string, password: string) => {
  const newUser = await prisma.user.create({ data: { username, password } });
  console.log(newUser);
  return newUser;
};

export const updateUserAction = async (
  id: number,
  username: string,
  password: string
) => {
  const updatedUser = await prisma.user.update({
    data: { username, password },
    where: { id },
  });
  console.log(updatedUser);
  return updatedUser;
};

export const deleteUserAction = async (id: number) => {
  const deletedUser = await prisma.user.delete({ where: { id } });
  console.log(deletedUser);
  return deletedUser;
};
