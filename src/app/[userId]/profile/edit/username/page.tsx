"use client";

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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function EditFormPage() {
  const { userId } = useParams();
  const { users, user, updateUser, isPending } = useUsers(Number(userId));

  const router = useRouter();

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
    updateUser(values.username, user?.password);

    router.push(`/${userId}/profile`);
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
                    <FormLabel>new username</FormLabel>
                    <FormControl>
                      <Input placeholder="new username" {...field} />
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
