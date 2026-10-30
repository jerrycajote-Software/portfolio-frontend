import Head from "next/head";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectCard, type ProjectCardData } from "@/components/ProjectCard";
import { prisma } from "@/lib/prisma";

export async function getStaticProps() {
  // Select only serializable fields (Date objects can't be passed as props)
  const projects: ProjectCardData[] = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, description: true, thumbnailUrl: true },
  });
  return { props: { projects }, revalidate: 60 };
}

export default function Home({ projects }: { projects: ProjectCardData[] }) {
  return (
    <>
      <Head>
        <title>Jerry Cajote – Portfolio</title>
        <meta name="description" content="Personal software engineering portfolio" />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <section className="my-12">
          <h1 className="text-4xl font-bold">Hi, I’m Jerry Cajote</h1>
          <p className="mt-4 text-lg">Software Engineer • Full‑stack • Cloud‑native</p>
        </section>
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
