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
import { useUsers } from "@/hooks/user";
import { UserType } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
  const { users, isPending } = useUsers();

  const router = useRouter();

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
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
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
