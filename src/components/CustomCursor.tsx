import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPhotoHovering, setIsPhotoHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    let targetX = -100;
    let targetY = -100;
    let currentTrailX = -100;
    let currentTrailY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');
      const photo = target.closest('[data-cursor-target="profile-photo"]');

      setIsHovering(Boolean(interactive));
      setIsPhotoHovering(Boolean(photo));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animateTrail = () => {
      currentTrailX += (targetX - currentTrailX) * 0.18;
      currentTrailY += (targetY - currentTrailY) * 0.18;
      setTrailPosition({ x: currentTrailX, y: currentTrailY });
      animationFrameId = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted || isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Precision inner dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-75 ease-out"
        style={{
          width: '8px',
          height: '8px',
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          backgroundColor: isPhotoHovering ? '#a855f7' : isHovering ? '#6366f1' : '#3b82f6',
        }}
      />

      {/* Smooth outer follower ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-40 rounded-full transition-all duration-200 ease-out flex items-center justify-center ${
          isPhotoHovering
            ? 'w-16 h-16 border-2 border-purple-500 bg-purple-500/10 backdrop-blur-[1px] shadow-lg shadow-purple-500/25 scale-110'
            : isHovering
            ? 'w-12 h-12 border border-indigo-500 bg-indigo-500/15 backdrop-blur-[1px] scale-100'
            : 'w-8 h-8 border border-blue-400/60 dark:border-blue-400/40 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailPosition.x - (isPhotoHovering ? 32 : isHovering ? 24 : 16)}px, ${
            trailPosition.y - (isPhotoHovering ? 32 : isHovering ? 24 : 16)
          }px, 0)`,
        }}
      >
        {isPhotoHovering && (
          <span className="text-[10px] tracking-wider uppercase font-bold text-purple-600 dark:text-purple-300">
            View
          </span>
        )}
      </div>
    </>
  );
}
