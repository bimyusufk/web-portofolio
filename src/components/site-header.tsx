"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ModeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/activities", label: "Activities" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100/80 bg-white/80 backdrop-blur-xl dark:bg-rose-50/80 dark:border-rose-100/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold text-rose-700">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-floating">
            BY
          </span>
          <div className="leading-tight">
            <div className="text-sm text-rose-300">Portfolio</div>
            <div className="text-base font-bold text-rose-700">Bim Yusuf</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-2 ring-1 ring-rose-100 backdrop-blur lg:flex dark:bg-rose-100/50 dark:ring-rose-100/20">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-semibold text-rose-700 transition hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-50",
                pathname === link.href && "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/20 dark:text-rose-50 dark:ring-rose-500/20",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="secondary" className="hidden sm:inline-flex" asChild>
            <Link href="/cv-bim-yusuf-karang.pdf" download>
              CV
            </Link>
          </Button>
          <Button className="hidden shadow-floating sm:inline-flex" asChild>
            <Link href="/contact">Let&apos;s talk</Link>
          </Button>

          {/* Mobile Menu Button (ensure high contrast and visibility on mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700 lg:hidden ring-1 ring-rose-100 hover:bg-rose-100"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-50 bg-surface/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col bg-white gap-2 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-900",
                  pathname === link.href && "bg-rose-50 text-rose-900",
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-rose-100" />
            <Link
              href="/cv-bim-yusuf-karang.pdf"
              download
              className="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-900"
            >
              Download CV
            </Link>
            <Button className="mt-2 w-full shadow-floating" asChild>
              <Link href="/contact">Let&apos;s talk</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
