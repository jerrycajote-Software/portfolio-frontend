export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/70 backdrop-blur-sm py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              JC
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Jerry Cajote</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Full Stack Developer</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
            © {currentYear} Jerry Cajote • All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
