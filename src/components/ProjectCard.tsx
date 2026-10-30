import Image from "next/image";
import Link from "next/link";

export interface ProjectCardData {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
}

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group">
        {project.thumbnailUrl && (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            width={400}
            height={250}
            className="object-cover w-full group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </Link>
  );
}
