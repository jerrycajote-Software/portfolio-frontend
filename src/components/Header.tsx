import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-lg">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Jerry Cajote</h1>
        <ul className="flex space-x-6">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/about" className="hover:underline">About</Link></li>
          <li><Link href="/skills" className="hover:underline">Skills</Link></li>
          <li><Link href="/projects" className="hover:underline">Projects</Link></li>
          <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
