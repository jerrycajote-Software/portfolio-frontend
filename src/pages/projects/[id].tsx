import { GetStaticPaths, GetStaticProps } from "next";
import type { Prisma } from "@prisma/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await prisma.project.findMany({ where: { published: true }, select: { id: true } });
  const paths = projects.map((p) => ({ params: { id: p.id.toString() } }));
  return { paths, fallback: "blocking" };
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

  // Select only serializable fields (Date objects can't be passed as props)
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
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        {project.thumbnailUrl && (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            width={800}
            height={500}
            className="rounded"
          />
        )}
        <p className="mt-4 leading-relaxed">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((pt) => (
            <span
              key={pt.tag.id}
              className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm"
            >
              {pt.tag.name}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-4">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              GitHub Repo
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              Live Demo
            </a>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
