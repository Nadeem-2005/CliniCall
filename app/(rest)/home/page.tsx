import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      Home
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
