import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Brand Name Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            JC
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Jerry Cajote
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side: Dark Mode Toggle & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Night / Light Mode Switch (Pure CSS toggle - zero hydration mismatch) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle night / light mode"
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
          >
            {/* Sun icon: visible in dark mode via CSS */}
            <svg
              className="hidden dark:block w-5 h-5 text-amber-400 animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>

            {/* Moon icon: visible in light mode via CSS */}
            <svg
              className="block dark:hidden w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
