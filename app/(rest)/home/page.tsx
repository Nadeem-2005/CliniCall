import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="realtive h-screen w-full overflow-hidden">
        {/* <Iridescence
        color={[0.85, 0.95, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      /> */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {" "}
          <div>
            Home
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
    </>
  );
}
