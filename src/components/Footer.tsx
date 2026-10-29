export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-6xl mx-auto text-center">
        <p>© {new Date().getFullYear()} Jerry Cajote • All rights reserved.</p>
        <p className="text-sm">Built with Next.js, TypeScript, Prisma, Cloudflare R2, and Cloudinary.</p>
      </div>
    </footer>
  );
}
