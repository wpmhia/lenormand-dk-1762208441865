"use client"

import Link from 'next/link';
import { Sparkles, Home, BookOpen, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors">
            Lenormand Intelligence
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 ml-auto">
          <Link
            href="/"
            className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/cards"
            className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Cards</span>
          </Link>
           <Link
             href="/read/new"
             className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary transition-colors"
           >
             <Plus className="w-4 h-4" />
             <span>New Reading</span>
           </Link>
          <Link
            href="/learn"
            className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Learn</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2 ml-auto md:ml-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-card-foreground hover:text-primary transition transform duration-150 ease-out hover:-translate-y-[1px] active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
          <nav className="container px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-colors py-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/cards"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-colors py-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cards</span>
            </Link>
             <Link
               href="/read/new"
               onClick={() => setMobileMenuOpen(false)}
               className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-colors py-2"
             >
               <Plus className="w-4 h-4" />
               <span>New Reading</span>
             </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-colors py-2"
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