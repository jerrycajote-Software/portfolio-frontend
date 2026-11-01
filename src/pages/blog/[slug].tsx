import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

interface BlogPostDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: string | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{ post: BlogPostDetail }> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : null;
  if (!slug) return { notFound: true };

  const row = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  if (!row) return { notFound: true, revalidate: 60 };

  return {
    props: {
      post: {
        ...row,
        publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      },
    },
    revalidate: 60,
  };
};

export default function BlogPostPage({ post }: { post: BlogPostDetail }) {
  return (
    <>
      <Head>
        <title>{`${post.title} – Jerry Cajote`}</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
      </Head>

      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Blog</span>
        </Link>

        <article className="reveal-item is-revealed">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>

          {post.publishedAt && (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
              Published on{' '}
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}

          {post.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800/80 mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {post.content}
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
