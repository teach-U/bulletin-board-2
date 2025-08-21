import { useEffect, useState, useTransition } from "react";

import {
  addUserAction,
  deleteUserAction,
  getAllUsersAction,
  getUserAction,
  updateUserAction,
} from "@/lib/actions/user";
import { UserType } from "@/types/type";

export const useUsers = (id?: number) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const users = await getAllUsersAction();
      console.log(users);
      setUsers(users);
      if (id == undefined) return;
      const user = await getUserAction(id);
      console.log(user);
      setUser(user!);
    });
  }, [id]);

  const addUser = (username: string, password: string) => {
    startTransition(async () => {
      const newUser = await addUserAction(username, password);
      setUser(newUser);
    });
  };

  const updateUser = (username?: string, password?: string) => {
    if (
      id === undefined ||
      user?.username === undefined ||
      user.password === undefined
    )
      return;
    startTransition(async () => {
      const newUser = await updateUserAction(
        id,
        username ?? user?.username,
        password ?? user?.password
      );
      setUser(newUser);
    });
  };

  const deleteUser = () => {
    if (id === undefined) return;
    startTransition(async () => {
      await deleteUserAction(id);
      setUser(undefined);
    });
  };

  return { users, user, isPending, addUser, updateUser, deleteUser };
};
