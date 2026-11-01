import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/70 backdrop-blur-sm py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              JC
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Jerry Cajote</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Full Stack Developer</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
            <Link href="/skills" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Skills</Link>
            <Link href="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projects</Link>
            <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} Jerry Cajote • All rights reserved.</p>
          <p>Built with Next.js, TypeScript, Tailwind CSS, Prisma, Cloudflare R2, and Cloudinary.</p>
        </div>
      </div>
    </footer>
  );
}
