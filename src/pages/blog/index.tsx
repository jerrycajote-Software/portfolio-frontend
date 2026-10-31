import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
}

export async function getStaticProps() {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  const posts: BlogPostSummary[] = rows.map((r) => ({
    ...r,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
  }));

  return { props: { posts }, revalidate: 60 };
}

export default function BlogIndex({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <>
      <Head>
        <title>Blog – Jerry Cajote</title>
        <meta name="description" content="Articles and notes on software engineering" />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto p-4 my-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">No published posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600">
                    {post.title}
                  </Link>
                </h2>
                {post.publishedAt && (
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
                {post.excerpt && <p className="text-gray-700 mb-4">{post.excerpt}</p>}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-indigo-600 font-medium hover:underline text-sm"
                >
                  Read article &rarr;
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
