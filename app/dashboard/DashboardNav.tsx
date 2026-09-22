"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="m16.5 9.4-9-5.19" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
        <path d="M12 22.08V12" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L3.41 13.41a2 2 0 0 1 0-2.82l7.18-7.18a2 2 0 0 1 1.41-.59H19a2 2 0 0 1 2 2v7a2 2 0 0 1-.59 1.41Z" />
        <circle cx="16" cy="8" r="1" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

const storeItems = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 5.6 15a1.7 1.7 0 0 0-1.56-1.03H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.1A1.7 1.7 0 0 0 5.6 6.94a1.7 1.7 0 0 0-.34-1.88L5.2 5l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 9.97 2.04V2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L20.74 5l-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 21.9 8H22a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.1A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    ),
  },
  {
    label: "Store Customization",
    href: "/dashboard/settings/customization",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M5.5 5.5 18.5 18.5" />
        <path d="M18.5 5.5 5.5 18.5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  // Store Customization should only activate itself
  if (href === "/dashboard/settings/customization") {
    return pathname === "/dashboard/settings/customization";
  }

  // Settings should not stay active on child pages
  if (href === "/dashboard/settings") {
    return pathname === "/dashboard/settings";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

  const linkClass = (href: string) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive(href)
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <>
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Main Menu
      </p>

      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <p className="mb-3 mt-9 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Store
      </p>

      <nav className="space-y-1.5">
        {storeItems.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}