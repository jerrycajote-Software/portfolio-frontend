import Image from 'next/image';

interface InteractiveProfileImageProps {
  imageSrc?: string;
  altText?: string;
  className?: string;
  sizeClassName?: string;
}

export function InteractiveProfileImage({
  imageSrc = '/my_picture.jfif',
  altText = 'Jerry Cajote',
  className = '',
  sizeClassName = 'w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44',
}: InteractiveProfileImageProps) {
  const containerClasses = ['flex justify-center select-none shrink-0', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={`relative ${sizeClassName} aspect-square rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm bg-slate-100 dark:bg-slate-800`}>
        <Image
          src={imageSrc}
          alt={altText}
          fill
          sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 176px"
          priority
          className="object-cover object-[center_15%]"
        />
      </div>
    </div>
  );
}
