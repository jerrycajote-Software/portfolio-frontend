import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

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
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{ post: BlogPostDetail }> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : null;
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
      <main className="max-w-3xl mx-auto p-4 my-8">
        <Link href="/blog" className="text-indigo-600 hover:underline text-sm">
          &larr; Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">{post.title}</h1>
        {post.publishedAt && (
          <p className="text-sm text-gray-500 mb-6">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={420}
            className="rounded-lg mb-6 object-cover w-full"
          />
        )}
        <div className="prose max-w-none whitespace-pre-line text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </main>
      <Footer />
    </>
  );
}
