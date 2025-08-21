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

export default function SignupPage() {
  const { users, user, isPending, addUser } = useUsers();

  const router = useRouter();

  const formSchema = z.object({
    username: z
      .string()
      .min(1, "ユーザー名を入力してください")
      .refine((val) => {
        return !users.some((user: UserType) => {
          return val === user.username
        });
      }, "その名前はすでに使用されています"),
    password: z.string().min(8, "8文字以上のパスワードを設定してください"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addUser(values.username, values.password);
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
              <Button type="submit">Sign up</Button>
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
