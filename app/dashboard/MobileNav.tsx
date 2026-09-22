"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { navItems, storeItems, isDashboardNavActive } from "./DashboardNav";

interface MobileNavProps {
  user: {
    name: string;
    email: string;
  };
}

export default function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const renderNavItems = (items: typeof navItems | typeof storeItems) => {
    return items.map((item) => {
      const active = isDashboardNavActive(pathname, item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            active
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      );
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5"
        >
          <Image
            src="/logo.jpeg"
            alt="SmallBiz"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />

          <span className="font-bold text-slate-900">SmallBiz</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/40 md:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[290px] flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.jpeg"
              alt="SmallBiz"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />

            <div>
              <p className="font-bold tracking-tight text-slate-900">
                SmallBiz
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Business Suite
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Main Menu */}
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1.5">{renderNavItems(navItems)}</nav>

          {/* Store */}
          <p className="mb-3 mt-9 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Store
          </p>

          <nav className="space-y-1.5">{renderNavItems(storeItems)}</nav>
        </div>

        {/* Sign out */}
        <div className="border-t border-slate-100 p-4">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg
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
        {/* User */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
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
        </div>
      </aside>
    </>
  );
}
