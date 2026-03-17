"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

interface NavBarProps {
  items: NavItem[];
  className?: string;
  rightSlot?: React.ReactNode;
  brand?: React.ReactNode;
}

export function NavBar({ items, className, rightSlot, brand }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="min-w-[140px]">
          {brand ?? (
            <span className="text-sm font-semibold text-foreground hidden md:inline">
              Newcomer Credit Navigator
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/" && pathname.startsWith(item.url));
            const Icon = item.icon;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span
                    className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary"
                    aria-hidden
                  />
                )}
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="min-w-[140px] flex items-center justify-end">
          {rightSlot}
        </div>
      </div>
    </nav>
  );
}
