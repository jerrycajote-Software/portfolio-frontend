import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { ProjectCard, type ProjectCardData } from '@/components/ProjectCard';

export async function getStaticProps() {
  const projects: ProjectCardData[] = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, description: true, thumbnailUrl: true },
  });
  return { props: { projects }, revalidate: 60 };
}

export default function Projects({ projects }: { projects: ProjectCardData[] }) {
  return (
    <>
      <Head>
        <title>Projects – Jerry Cajote | Full Stack Developer</title>
        <meta
          name="description"
          content="Explore the full stack software engineering projects, web applications, and repositories developed by Jerry Cajote."
        />
      </Head>

      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-10 text-center sm:text-left reveal-item is-revealed">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <span>Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            All Projects
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">
            Showcase of production applications, developer tools, and full-stack solutions.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400">No published projects yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="reveal-item">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
