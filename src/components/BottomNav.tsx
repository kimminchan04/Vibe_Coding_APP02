"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "검색", icon: "🔍" },
  { href: "/advice", label: "AI조언", icon: "💡" },
  { href: "/logs", label: "내기록", icon: "📋" },
  { href: "/profile", label: "프로필", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  const hidden = ["/login", "/signup"].some((p) => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-gray-200 bg-white">
      <div className="flex">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                active ? "font-semibold text-primary" : "text-muted"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
