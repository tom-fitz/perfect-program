import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function SignIn() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-full max-w-sm">
        <div className="flex flex-col items-center gap-6">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={120}
            height={25}
            priority
          />
          
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/app" });
            }}
          >
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full"
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                width={16}
                height={16}
              />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 