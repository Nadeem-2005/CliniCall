import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="bg-black flex flex-row gap-3 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-200"
      >
        Sign Out
      </button>
    </form>
  );
}
