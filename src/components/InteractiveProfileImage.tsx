import { useState, useRef } from 'react';
import Image from 'next/image';

interface InteractiveProfileImageProps {
  imageSrc?: string;
  altText?: string;
}

export function InteractiveProfileImage({
  imageSrc = '/my_picture.jpg',
  altText = 'Jerry Cajote - Full Stack Developer',
}: InteractiveProfileImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <div className="relative group w-full max-w-[320px] sm:max-w-[360px] mx-auto select-none">
        {/* Animated aura glow behind picture */}
        <div
          className={`absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-2xl transition-all duration-700 pointer-events-none ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-60 scale-95'
          }`}
        />

        {/* Ambient spinning ring border effect */}
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-[1px] animate-pulse" />

        {/* 3D Tilt interactive container */}
        <div
          ref={cardRef}
          data-cursor-target="profile-photo"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsModalOpen(true)}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
              isHovered ? 1.02 : 1
            }, ${isHovered ? 1.02 : 1}, 1)`,
            transition: isHovered
              ? 'transform 0.1s ease-out'
              : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl cursor-pointer"
        >
          {/* Main Photo with smooth zoom */}
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={altText}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 360px"
              priority
              className={`object-cover object-center transition-transform duration-700 ease-out ${
                isHovered ? 'scale-108 filter saturate-110' : 'scale-100'
              }`}
            />

            {/* Dynamic Glass Glare reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
              }}
            />

            {/* Gradient shadow for contrast at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Floating Role & Status badge inside the card */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-white/90 tracking-wide">
                  Available for Hire
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-white/90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Floating tech badge underneath */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Interactive 3D Tilt • Hover or Tap to Expand</span>
        </div>
      </div>

      {/* Lightbox / Fullview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={imageSrc}
                alt={altText}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 bg-slate-900 text-center">
              <h3 className="text-lg font-semibold text-white">Jerry Cajote</h3>
              <p className="text-sm text-indigo-400">Full Stack Developer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

