import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";

export async function getStaticProps() {
  const projects = await prisma.project.findMany({ include: { tags: true } });
  return { props: { projects } };
}

export default function Projects({ projects }) {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
