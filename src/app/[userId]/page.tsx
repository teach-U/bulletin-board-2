"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/user";

export default function UserPage() {
  const { userId } = useParams();
  const { user, isPending } = useUsers(Number(userId));

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
