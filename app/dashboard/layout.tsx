import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import DashboardNav from "./DashboardNav";
import MobileNav from "./MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-slate-200 bg-white md:flex">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-100 px-7">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm"> */}
            <Image
              src="/logo.jpeg"
              alt="SmallBiz"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            {/* </div> */}

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                SmallBiz
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Business Suite
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <DashboardNav />
        </div>

        {/* User section */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </p>

              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen md:ml-72">
  <MobileNav
    user={{
      name: user.name,
      email: user.email,
    }}
  />

  <div className="p-5 sm:p-7 md:p-10">
    {children}
  </div>
</main>
    </div>
  );
}
