import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="signup">Sign up</Link>
      <Link href="login">Log in</Link>
    </main>
  );
}
