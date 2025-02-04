import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();

  console.log(session);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Link 
          href="/app" 
          className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-ebony rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full border-4 border-ebony overflow-hidden bg-gray-700">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile picture"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-powder mb-1">
                {session.user.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {session.user.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {joinDate}
                </div>
              </div>
            </div>

            <form action={async () => {
              'use server';
              await signOut({ redirectTo: "/" });
            }}>
              <button 
                type="submit"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </form>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details */}
            <div className="p-6 rounded-xl bg-gray-900/50">
              <h2 className="text-lg font-semibold mb-4 text-powder">Account Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-200">{session.user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-200">{session.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Account Type</dt>
                  <dd className="mt-1 text-sm">
                    {session.user.email === 'tpfitz42@gmail.com' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                        Member
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Stats */}
            <div className="p-6 rounded-xl bg-gray-900/50">
              <h2 className="text-lg font-semibold mb-4 text-powder">Activity Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-400">Workouts</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-200">0</div>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-400">Programs</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-200">0</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 p-6 rounded-xl bg-gray-900/50">
              <h2 className="text-lg font-semibold mb-4 text-powder">Recent Activity</h2>
              <div className="text-sm text-gray-400 text-center py-8">
                No recent activity to display
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
