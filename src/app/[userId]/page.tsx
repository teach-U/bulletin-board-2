"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { UserType } from "@/types/type";
import { getUserAction } from "@/lib/actions/user";

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const user = await getUserAction(Number(userId));
      setUser(user!);
    });
  }, [userId]);

  return (
    <div>
      {isPending ? (
        <div>Loading</div>
      ) : (
        <div>
          <div>{user?.id}</div>
          <div>{user?.username}</div>
          <div>{user?.password}</div>
          <div>{String(user?.createAt)}</div>
          <div>{String(user?.updateAt)}</div>
          <div>
            <Button>
              <Link href={`/${userId}/profile`}>プロフィール</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
