import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="leading-relaxed">
          {/* Content from Personal_Software_Engineering_Portfolio.md */}
          I am a passionate software engineer with experience in full‑stack development, cloud services, and modern UI/UX design.
        </p>
      </main>
      <Footer />
    </>
  );
}
