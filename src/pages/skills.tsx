import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

interface SkillItem {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  level: number;
}

export async function getStaticProps() {
  const skills: SkillItem[] = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { level: 'desc' }, { name: 'asc' }],
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
        <title>Skills &amp; Technologies – Jerry Cajote</title>
        <meta
          name="description"
          content="Technical skills, proficiency, frameworks, and technologies used by Jerry Cajote."
        />
      </Head>

      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-10 text-center sm:text-left reveal-item is-revealed">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <span>Tech Stack &amp; Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Skills &amp; Technologies
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">
            Overview of technical competencies, tools, and platforms I work with.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400">No skills added yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <section
                key={category}
                className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm reveal-item"
              >
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{category}</h2>
                </div>
                <ul className="space-y-4">
                  {grouped[category].map((skill) => (
                    <li key={skill.id} className="group">
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
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
