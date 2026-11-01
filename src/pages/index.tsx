import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectCard, type ProjectCardData } from '@/components/ProjectCard';
import { InteractiveProfileImage } from '@/components/InteractiveProfileImage';
import { prisma } from '@/lib/prisma';

export async function getStaticProps() {
  const projects: ProjectCardData[] = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, description: true, thumbnailUrl: true },
  });
  return { props: { projects }, revalidate: 60 };
}

export default function Home({ projects }: { projects: ProjectCardData[] }) {
  const techBadges = [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'Prisma',
    'Tailwind CSS',
    'PostgreSQL',
    'Cloudflare R2',
  ];

  return (
    <>
      <Head>
        <title>Jerry Cajote – Full Stack Developer</title>
        <meta
          name="description"
          content="Portfolio of Jerry Cajote, Full Stack Developer specializing in high-performance web applications and modern cloud architectures."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      {/* Background ambient decorative glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Hero Section */}
        <section className="pt-8 sm:pt-14 pb-16 md:pb-24 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Hero Left Content */}
          <div className="flex-1 text-center md:text-left reveal-item is-revealed">
            {/* Status pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full Stack Developer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Hi, I’m{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Jerry Cajote
              </span>
            </h1>

            <p className="mt-3 text-xl sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
              Full Stack Developer
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto md:mx-0 leading-relaxed font-normal">
              I build robust, high-performance web applications from database schemas to polished, responsive, and animated user experiences.
            </p>

            {/* Call to action buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/projects"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>View Projects</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                Get in Touch
              </Link>
            </div>

            {/* Tech stack badge list */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Core Technologies
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {techBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right Picture (Animated & Interactable) */}
          <div className="flex-1 w-full flex justify-center reveal-item is-revealed">
            <InteractiveProfileImage
              imageSrc="/my_picture.jpg"
              altText="Jerry Cajote - Full Stack Developer"
            />
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-12 border-t border-slate-200/60 dark:border-slate-800/60 reveal-item">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Full-Stack Architecture</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamlessly connecting modern client interfaces with reliable serverless APIs, Prisma ORM, and cloud storage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Modern UI/UX &amp; Animations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Crafted with responsive layouts, smooth scroll translation animations, and interactive micro-interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Performance &amp; Scalability</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimized page speeds, incremental static regeneration (ISR), responsive assets, and secure edge caching.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-16 reveal-item">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                Portfolio Showcase
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>View all projects</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="reveal-item">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
