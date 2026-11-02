import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectCard, type ProjectCardData } from '@/components/ProjectCard';
import { CertificateCard, type CertificateData } from '@/components/CertificateCard';
import { CertificateModal } from '@/components/CertificateModal';
import { InteractiveProfileImage } from '@/components/InteractiveProfileImage';
import { prisma } from '@/lib/prisma';

export async function getStaticProps() {
  const [projects, rawCertificates, profile] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, description: true, thumbnailUrl: true },
    }),
    prisma.certificate.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { issuedDate: 'desc' }, { createdAt: 'desc' }],
      take: 3,
    }),
    prisma.profile.findFirst({
      orderBy: { id: 'asc' },
    }),
  ]);

  const certificates: CertificateData[] = rawCertificates.map((c: any) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    issuedDate: c.issuedDate ? c.issuedDate.toISOString() : null,
    credentialId: c.credentialId ?? null,
    verificationUrl: c.verificationUrl ?? null,
    imageUrl: c.imageUrl ?? null,
    // Do not leak raw unredacted PDF URL to the public if privacy redaction is active
    pdfUrl: c.blurData ? null : (c.pdfUrl ?? null),
    blurData: c.blurData ?? null,
    description: c.description ?? null,
    featured: Boolean(c.featured),
  }));

  return {
    props: {
      projects,
      certificates,
      profileName: profile?.fullName ?? 'Jerry Cajote',
      profileRole: profile?.role ?? 'Full Stack Developer',
      profileLocation: profile?.location ?? 'General Trias, Cavite',
      profileBio: profile?.bio ?? null,
    },
    revalidate: 60,
  };
}

interface HomeProps {
  projects: ProjectCardData[];
  certificates: CertificateData[];
  profileName?: string;
  profileRole?: string;
  profileLocation?: string;
  profileBio?: string | null;
}

export default function Home({
  projects,
  certificates,
  profileName = 'Jerry Cajote',
  profileRole = 'Full Stack Developer',
  profileLocation = 'General Trias, Cavite',
  profileBio = null,
}: HomeProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  return (
    <>
      <Head>
        <title>{`${profileName} – ${profileRole}`}</title>
        <meta
          name="description"
          content={`Portfolio of ${profileName}, ${profileRole} specializing in high-performance web applications and modern cloud architectures.`}
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
        <section className="pt-8 sm:pt-14 pb-12">
          {/* Reference Profile Header: Square Picture on Left, Info on Right */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 md:gap-10 reveal-item is-revealed">
            {/* Left: Square Profile Picture (Cropped to Face) */}
            <InteractiveProfileImage
              imageSrc="/my_picture.jpg"
              altText={`${profileName} - ${profileRole}`}
            />

            {/* Right: Info & Actions */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              {/* Name + Verified Checkmark Badge */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {profileName}
                </h1>
                <span
                  className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 text-white shrink-0 shadow-sm"
                  title="Verified Profile"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>

              {/* Location with Icon */}
              <div className="flex items-center gap-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{profileLocation}</span>
              </div>

              {/* Role Title */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium mt-2">
                {profileRole}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Message Me</span>
                </Link>
                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Read my blog</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section: About */}
          <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 reveal-item is-revealed">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              About
            </h2>
            <div className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-4xl space-y-4">
              {profileBio ? (
                <p className="whitespace-pre-line">{profileBio}</p>
              ) : (
                <>
                  <p>
                    I build robust, high-performance web applications from database schemas to polished, responsive, and animated user experiences.
                  </p>
                  <p>
                    My engineering practice focuses on TypeScript, modern React and Next.js ecosystems, Prisma ORM, and resilient cloud backend architectures.
                  </p>
                </>
              )}
            </div>
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

        {/* Certificates & Qualifications Section */}
        {certificates.length > 0 && (
          <section className="py-16 border-t border-slate-200/60 dark:border-slate-800/60 reveal-item">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  Credentials &amp; Accreditations
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  Certificates
                </h2>
              </div>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <span>View all certificates</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="reveal-item">
                  <CertificateCard
                    certificate={cert}
                    onView={(c) => setSelectedCert(c)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Footer />
    </>
  );
}
