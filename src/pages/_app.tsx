import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useScrollReveal();

  useEffect(() => {
    // Re-trigger scroll reveal on route changes
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-item');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add('is-revealed');
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [router.asPath]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#090d16] dark:text-[#f8fafc] transition-colors duration-300">
      <Component {...pageProps} />
    </div>
  );
}

export default function MyApp(props: AppProps) {
  return (
    <ThemeProvider>
      <AppContent {...props} />
    </ThemeProvider>
  );
}

