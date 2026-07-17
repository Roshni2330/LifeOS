"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Future paths", href: "#future-paths" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <nav className="glass-panel page-container flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <Sparkles size={18} className="text-white" />
          </span>

          <div className="flex items-center">
            <span className="text-lg font-semibold tracking-tight text-white">
              LifeOS
            </span>
            <span className="ml-1 text-sm font-semibold text-secondary">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/onboarding"
          className="group flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
        >
          Start simulation
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </nav>
    </header>
  );
}