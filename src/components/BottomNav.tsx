"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "검색", icon: "⌕" },
  { href: "/advice", label: "AI 조언", icon: "!" },
  { href: "/logs", label: "내 기록", icon: "□" },
  { href: "/profile", label: "프로필", icon: "○" },
];

export function BottomNav() {
  const pathname = usePathname();
  const hidden = ["/login", "/signup"].some((p) => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-accent/10 bg-white/95 backdrop-blur">
      <div className="flex">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                active ? "font-semibold text-accent" : "text-muted"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
