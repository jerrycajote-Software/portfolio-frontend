import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const themeInitScript = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('portfolio-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/futura-pt" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f8fafc] text-[#0f172a] dark:bg-[#090d16] dark:text-[#f8fafc] antialiased selection:bg-brand-500 selection:text-white"
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
