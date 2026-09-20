"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogoImage } from "@/components/BrandLogo";
import { SearchBox } from "@/components/SearchBox";

const NAV = [
  { href: "/search", label: "Search" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const showHeaderSearch = pathname !== "/" && !pathname.startsWith("/search");

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label="PropertyRadar home">
          <BrandLogoImage className="h-11 w-auto sm:h-12" />
        </Link>
        {showHeaderSearch ? (
          <div className="hidden min-w-0 flex-1 sm:block sm:max-w-md sm:px-3">
            <SearchBox size="sm" />
          </div>
        ) : null}
        <nav className="flex shrink-0 items-center gap-1 text-sm font-medium">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-full bg-cream px-3 py-1.5 text-navy"
                    : "rounded-full px-3 py-1.5 text-navy-2 hover:bg-cream hover:text-navy"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {showHeaderSearch ? (
        <div className="border-t border-line/60 px-4 py-2 sm:hidden">
          <SearchBox size="sm" />
        </div>
      ) : null}
    </header>
  );
}
