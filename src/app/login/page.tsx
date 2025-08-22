"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { UserType } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { getAllUsersAction } from "@/lib/actions/user";

export default function LoginPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const users = await getAllUsersAction();
      setUsers(users);
    });
  }, []);

  const formSchema = z
    .object({
      username: z
        .string()
        .min(1, "ユーザー名を入力してください")
        .refine((val) => users.some((user: UserType) => val === user.username)),
      password: z.string().min(8, "8文字以上のパスワードを入力してください"),
    })
    .refine(
      (data) => {
        const user = users.find(
          (user: UserType) => data.username === user.username
        );
        return user?.password === data.password;
      },
      {
        message: "ユーザー名またはパスワードが間違っています",
        path: ["password"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = users.find(
      (user: UserType) => values.username === user.username
    );
    router.push(`/${user?.id}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {isPending ? (
        <div className="text-gray-700 text-4xl font-semibold">Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3">
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
                    <FormLabel>username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Log in</Button>
            </form>
          </Form>
          <Button variant="secondary">
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
