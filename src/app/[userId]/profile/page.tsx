"use client";

import { useParams } from "next/navigation";

import { EditIcon } from "./components/icon/edit-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { UserType } from "@/types/type";
import { getUserAction } from "@/lib/actions/user";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | undefined>();
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
          <div>
            <Button variant="ghost">
              <Link href={`/${userId}/profile/edit/username`}>
                <EditIcon />
              </Link>
            </Button>
            <span>{user?.username}</span>
          </div>
          <div>
            <Button variant="ghost">
              <Link href={`/${userId}/profile/edit/password`}>
                <EditIcon />
              </Link>
            </Button>
            <span>{user?.password}</span>
          </div>
        </div>
      )}
    </div>
  );
}
