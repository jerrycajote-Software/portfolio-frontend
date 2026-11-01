import Head from "next/head";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

interface SkillItem {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  level: number;
}

export async function getStaticProps() {
  const skills: SkillItem[] = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { level: "desc" }, { name: "asc" }],
    select: { id: true, name: true, category: true, icon: true, level: true },
  });
  return { props: { skills }, revalidate: 60 };
}

export default function Skills({ skills }: { skills: SkillItem[] }) {
  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <>
      <Head>
        <title>Skills – Jerry Cajote</title>
        <meta name="description" content="Technical skills and proficiency across the stack" />
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto p-4 my-8">
        <h1 className="text-4xl font-bold mb-8">Skills &amp; Technologies</h1>

        {categories.length === 0 ? (
          <p className="text-gray-600">No skills added yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <section key={category} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-indigo-700">{category}</h2>
                <ul className="space-y-4">
                  {grouped[category].map((skill) => (
                    <li key={skill.id}>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

