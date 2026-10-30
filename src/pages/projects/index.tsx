import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { ProjectCard, type ProjectCardData } from "@/components/ProjectCard";

export async function getStaticProps() {
  // Select only serializable fields (Date objects can't be passed as props)
  const projects: ProjectCardData[] = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, description: true, thumbnailUrl: true },
  });
  return { props: { projects }, revalidate: 60 };
}

export default function Projects({ projects }: { projects: ProjectCardData[] }) {
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
