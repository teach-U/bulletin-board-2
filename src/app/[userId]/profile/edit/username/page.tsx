"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  getAllUsersAction,
  getUserAction,
  updateUserAction,
} from "@/lib/actions/user";
import { UserType } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditFormPage() {
  const { userId } = useParams();
  const [users, setUsers] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const users = await getAllUsersAction();
      setUsers(users);

      const user = await getUserAction(Number(userId));
      setUser(user!);
    });
  }, [userId]);

  const formSchema = z.object({
    username: z
      .string()
      .min(1, "ユーザー名を入力してください")
      .refine(
        (val) =>
          !users.some((user: UserType) => {
            return user.username === val;
          }, "そのユーザー名はすでに使用されています")
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username ?? "",
    },
  });

  useEffect(() => {
    if (user) form.reset({ username: user.username });
  }, [form, user]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const user = await updateUserAction(Number(userId), values.username);
      setUser(user);

      router.push(`/${userId}/profile`);
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {isPending ? (
        <div className="text-3xl font-bold">Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Form {...form}>
            <form
              className="flex flex-col items-center justify-center space-y-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormLabel>new username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="new username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">変更</Button>
            </form>
          </Form>
          <Button variant="secondary">Cancel</Button>
        </div>
      )}
    </div>
  );
}
