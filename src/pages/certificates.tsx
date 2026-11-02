import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CertificateCard, type CertificateData } from '@/components/CertificateCard';
import { CertificateModal } from '@/components/CertificateModal';
import { prisma } from '@/lib/prisma';

export async function getStaticProps() {
  const rawCertificates = await prisma.certificate.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { issuedDate: 'desc' }, { createdAt: 'desc' }],
  });

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

  return { props: { certificates }, revalidate: 60 };
}

export default function Certificates({
  certificates,
}: {
  certificates: CertificateData[];
}) {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');

  const issuers = ['All', ...Array.from(new Set(certificates.map((c) => c.issuer)))];

  const filteredCertificates =
    selectedIssuer === 'All'
      ? certificates
      : certificates.filter((c) => c.issuer === selectedIssuer);

  return (
    <>
      <Head>
        <title>Certificates &amp; Credentials – Jerry Cajote</title>
        <meta
          name="description"
          content="Professional certifications, credentials, verified qualifications, and software engineering certificates of Jerry Cajote."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left reveal-item is-revealed">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Verified Credentials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Certificates &amp; Qualifications
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Continuous professional development, verified industry certifications, and specialized technical accreditations.
          </p>

          {/* Issuer Filters */}
          {issuers.length > 2 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {issuers.map((issuer) => {
                const active = selectedIssuer === issuer;
                return (
                  <button
                    key={issuer}
                    type="button"
                    onClick={() => setSelectedIssuer(issuer)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {issuer}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificate Cards Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <p className="text-slate-600 dark:text-slate-400">
              No certificates available under this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((cert) => (
              <div key={cert.id} className="reveal-item">
                <CertificateCard
                  certificate={cert}
                  onView={(c) => setSelectedCert(c)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox / Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Footer />
    </>
  );
}

