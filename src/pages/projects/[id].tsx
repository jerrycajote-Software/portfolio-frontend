import { GetStaticPaths, GetStaticProps } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await prisma.project.findMany({ select: { id: true } });
  const paths = projects.map((p) => ({ params: { id: p.id.toString() } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = await prisma.project.findUnique({
    where: { id: Number(params?.id) },
    include: { tags: true },
  });
  if (!project) return { notFound: true };
  return { props: { project } };
};

export default function ProjectDetail({ project }: any) {
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
          {project.tags?.map((pt: any) => (
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
