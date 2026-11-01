import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { Prisma } from '@prisma/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await prisma.project.findMany({ where: { published: true }, select: { id: true } });
  const paths = projects.map((p) => ({ params: { id: p.id.toString() } }));
  return { paths, fallback: 'blocking' };
};

const projectSelect = {
  id: true,
  title: true,
  description: true,
  thumbnailUrl: true,
  repoUrl: true,
  liveUrl: true,
  tags: { select: { tag: { select: { id: true, name: true } } } },
} satisfies Prisma.ProjectSelect;

type ProjectDetailData = Prisma.ProjectGetPayload<{ select: typeof projectSelect }>;

export const getStaticProps: GetStaticProps<{ project: ProjectDetailData }> = async ({ params }) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id)) return { notFound: true };

  const project = await prisma.project.findFirst({
    where: { id, published: true },
    select: projectSelect,
  });
  if (!project) return { notFound: true, revalidate: 60 };
  return { props: { project }, revalidate: 60 };
};

export default function ProjectDetail({ project }: { project: ProjectDetailData }) {
  return (
    <>
      <Head>
        <title>{`${project.title} – Jerry Cajote`}</title>
        <meta name="description" content={project.description.slice(0, 160)} />
      </Head>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <div className="mb-6 reveal-item is-revealed">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {project.title}
          </h1>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((pt) => (
              <span
                key={pt.tag.id}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80"
              >
                {pt.tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Project Image */}
        {project.thumbnailUrl && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800/80 mb-8 bg-slate-900">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Live Demo</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 shadow-sm"
            >
              <span>GitHub Repository</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}
        </div>

        {/* Project Description */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm leading-relaxed text-slate-700 dark:text-slate-300 text-base sm:text-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About this Project</h2>
          <p className="whitespace-pre-line">{project.description}</p>
        </div>
      </main>

      <Footer />
    </>
  );
}
