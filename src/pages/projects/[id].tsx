import { useState } from 'react';
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
  demoVideos: true,
  tags: { select: { tag: { select: { id: true, name: true } } } },
} satisfies Prisma.ProjectSelect;

type ProjectDetailData = Prisma.ProjectGetPayload<{ select: typeof projectSelect }>;

export interface DemoVideo {
  id: string;
  url: string;
  title: string;
  description?: string;
  sizeBytes?: number;
  mimeType?: string;
  durationSeconds?: number;
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?rel=0`;
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.replace('/shorts/', '');
        if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
      }
    }
    if (parsed.hostname.includes('youtu.be')) {
      const v = parsed.pathname.replace(/^\//, '');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?rel=0`;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

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
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  let demoVideos: DemoVideo[] = [];
  if (project.demoVideos) {
    try {
      const parsed = JSON.parse(project.demoVideos);
      if (Array.isArray(parsed)) {
        demoVideos = parsed;
      }
    } catch {}
  }

  const currentVideo = demoVideos[activeVideoIndex] || demoVideos[0];
  const embedUrl = currentVideo ? getEmbedUrl(currentVideo.url) : null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

        {/* Demo Videos Showcase */}
        {demoVideos.length > 0 && (
          <section className="mb-10 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Project Demo &amp; Walkthroughs</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Interactive preview and high-definition video demonstrations
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
                {demoVideos.length} {demoVideos.length === 1 ? 'Video' : 'Videos'} Available
              </span>
            </div>

            {/* Video Selector Tabs (if more than 1 video) */}
            {demoVideos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-thin">
                {demoVideos.map((vid, idx) => {
                  const isActive = idx === activeVideoIndex;
                  return (
                    <button
                      key={vid.id || idx}
                      type="button"
                      onClick={() => setActiveVideoIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                      }`}
                    >
                      <span>🎬 #{idx + 1}</span>
                      <span className="truncate max-w-[140px]">{vid.title || `Demo ${idx + 1}`}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Video Player Screen */}
            {currentVideo && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={currentVideo.title || 'Project Demo Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      key={currentVideo.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain bg-black"
                    >
                      <source
                        src={currentVideo.url}
                        type={currentVideo.mimeType || 'video/mp4'}
                      />
                      Your browser does not support HTML5 video playback.
                    </video>
                  )}
                </div>

                {/* Video Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {currentVideo.title || `Demo Video ${activeVideoIndex + 1}`}
                    </h3>
                    {currentVideo.description && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {currentVideo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {currentVideo.sizeBytes && (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-700">
                        {formatFileSize(currentVideo.sizeBytes)}
                      </span>
                    )}
                    <a
                      href={currentVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <span>Open Video</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

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
