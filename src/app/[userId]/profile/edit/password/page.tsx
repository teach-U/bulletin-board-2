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
import { getUserAction, updateUserAction } from "@/lib/actions/user";
import { UserType } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function EditFormPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const user = await getUserAction(Number(userId));
      setUser(user!);
    });
  }, [userId]);

  const formSchema = z.object({
    password: z.string().min(1, "パスワードを入力してください"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: user?.password ?? "",
    },
  });

  useEffect(() => {
    if (user) form.reset({ password: user.password });
  }, [form, user]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const updatedUser = await updateUserAction(
        Number(userId),
        undefined,
        values.password
      );
      setUser(updatedUser);

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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>new password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="new password"
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
