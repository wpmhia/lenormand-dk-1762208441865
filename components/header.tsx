"use client"

import Link from 'next/link';
import { Sparkles, Home, BookOpen, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-900/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-semibold text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            Lenormand Intelligence
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 ml-auto">
          <Link
            href="/"
            className="flex items-center space-x-1 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/cards"
            className="flex items-center space-x-1 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Cards</span>
          </Link>
          <Link
            href="/read/new"
            className="flex items-center space-x-1 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Reading</span>
          </Link>
          <Link
            href="/learn"
            className="flex items-center space-x-1 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Learn</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2 ml-auto md:ml-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <nav className="container px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/cards"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cards</span>
            </Link>
            <Link
              href="/read/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Reading</span>
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Learn</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}