import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InteractiveProfileImage } from '@/components/InteractiveProfileImage';

export default function About() {
  return (
    <>
      <Head>
        <title>About Me – Jerry Cajote | Full Stack Developer</title>
        <meta
          name="description"
          content="Learn more about Jerry Cajote, background, full stack software development experience, and technical philosophy."
        />
      </Head>

      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Portrait */}
          <div className="md:col-span-5 reveal-item is-revealed flex justify-center">
            <InteractiveProfileImage
              imageSrc="/my_picture.jpg"
              altText="Jerry Cajote"
            />
          </div>

          {/* Right Column: Bio Content */}
          <div className="md:col-span-7 reveal-item is-revealed">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
              <span>Full Stack Developer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              About Me
            </h1>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              <p>
                Hello! I’m Jerry Cajote, a passionate <strong className="text-slate-900 dark:text-white font-semibold">Full Stack Developer</strong> dedicated to engineering robust web applications, responsive user interfaces, and scalable backend services.
              </p>
              <p>
                My focus spans modern JavaScript/TypeScript ecosystems, building clean frontends with React and Next.js, and architecting resilient backend systems with Node.js, Prisma ORM, and cloud services including Cloudflare R2 and Cloudinary.
              </p>
              <p>
                Whether designing frictionless interactive micro-animations, writing modular APIs, or optimizing production databases, I prioritize code quality, maintainability, and exceptional user experience.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Role</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">Full Stack Developer</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Location</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-1">Available Globally (Remote)</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-indigo-500/20"
              >
                Browse Projects
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                Let&apos;s Connect
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
