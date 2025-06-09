import { signIn } from "@/auth";
import { FaGoogle } from "react-icons/fa"; // White Google icon

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="bg-black flex flex-row gap-3 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-200"
      >
        <FaGoogle className="text-white text-sm" />
        Google
      </button>
    </form>
  );
}
