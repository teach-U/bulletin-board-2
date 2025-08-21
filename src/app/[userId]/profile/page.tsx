"use client";

import { useParams } from "next/navigation";

import { useUsers } from "@/hooks/user";

import { EditIcon } from "./components/icon/edit-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, isPending } = useUsers(Number(userId));
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
