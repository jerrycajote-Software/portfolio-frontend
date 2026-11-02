import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type CertificateData } from './CertificateCard';

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isModalExpanded, setIsModalExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEnlarged) {
          setIsEnlarged(false);
          setZoomLevel(1);
        } else {
          onClose();
        }
      }
    };
    if (certificate) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [certificate, onClose, isEnlarged]);

  if (!certificate) return null;

  const handleCopyId = () => {
    if (!certificate.credentialId) return;
    navigator.clipboard.writeText(certificate.credentialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return null;
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(certificate.issuedDate);

  let blurZones: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    showWatermark?: boolean;
    label?: string;
  }> = [];

  if (certificate.blurData) {
    try {
      const parsed = JSON.parse(certificate.blurData);
      if (Array.isArray(parsed.zones) && parsed.zones.length > 0) {
        blurZones = parsed.zones;
      } else if (typeof parsed.x === "number") {
        blurZones = [parsed];
      }
    } catch {
      blurZones = [];
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isModalExpanded ? 'max-w-5xl max-h-[96vh]' : 'max-w-3xl max-h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {certificate.issuer}
            </span>
            {certificate.featured && (
              <span className="text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                ★ Featured Credential
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalExpanded((prev) => !prev)}
              aria-label={isModalExpanded ? 'Collapse modal' : 'Expand modal'}
              title={isModalExpanded ? 'Collapse modal size' : 'Expand modal size'}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              {isModalExpanded ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0M4 4l0 5m11 11l5 5m0 0l-5 0m5 0l0-5M9 15l-5 5m0 0l5 0M4 20l0-5m11-11l5-5m0 0l-5 0m5 0l0 5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate modal"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Certificate Image Viewer */}
          <div
            onClick={() => {
              if (certificate.imageUrl) {
                setIsEnlarged(true);
                setZoomLevel(1);
              }
            }}
            className={`relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center transition-all ${
              certificate.imageUrl ? 'cursor-zoom-in group' : ''
            } ${isModalExpanded ? 'aspect-[16/11] max-h-[65vh]' : 'aspect-[16/10]'}`}
            title={certificate.imageUrl ? "Click to view larger in fullscreen" : undefined}
          >
            {certificate.imageUrl ? (
              <>
                <Image
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  fill
                  unoptimized
                  className="object-contain w-full h-full"
                />

                {/* Option 2: Dynamic Frosted Glass Privacy Overlay */}
                {blurZones.map((zone, idx) => (
                  <div
                    key={idx}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                    }}
                    className="absolute pointer-events-none rounded-lg backdrop-blur-md bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/60 shadow-sm flex items-center justify-center p-1 z-10"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-xs border border-white/20">
                      <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>{zone.label || "Signature Redacted"}</span>
                    </div>
                  </div>
                ))}

                {/* Floating "View Larger" pill on top right */}
                <div className="absolute top-3 right-3 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 border border-white/15 transition-transform group-hover:scale-105">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span>View Larger</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Official Certificate of Completion
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Issued by {certificate.issuer}
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h2 id="cert-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {certificate.title}
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Issuing Organization
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {certificate.issuer}
                </span>
              </div>

              {formattedDate && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Issue Date
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>

            {certificate.credentialId && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Credential ID
                  </span>
                  <code className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                    {certificate.credentialId}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy ID'}
                </button>
              </div>
            )}

            {certificate.description && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Credential Description &amp; Competencies
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {certificate.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {certificate.pdfUrl && !certificate.blurData && (
              <a
                href={certificate.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>View Source PDF</span>
              </a>
            )}
            {certificate.blurData && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5">
                <span>🔒</span>
                <span>Signatures Redacted for Privacy</span>
              </span>
            )}
          </div>

          {certificate.verificationUrl && (
            <a
              href={certificate.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <span>Verify Credential</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Fullscreen Enlarged Lightbox View */}
      {isEnlarged && certificate.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged certificate preview"
          className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-lg flex flex-col p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setIsEnlarged(false);
            setZoomLevel(1);
          }}
        >
          {/* Top Bar with Controls */}
          <div
            className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800 text-white flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {certificate.title}
              </h3>
              <p className="text-xs text-slate-400">{certificate.issuer}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-sm">
                <button
                  type="button"
                  disabled={zoomLevel <= 0.75}
                  onClick={() => setZoomLevel((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
                  className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center font-bold text-sm transition-colors"
                  title="Zoom Out"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors"
                  title="Reset to 100%"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  disabled={zoomLevel >= 2.5}
                  onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                  className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center font-bold text-sm transition-colors"
                  title="Zoom In"
                >
                  +
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEnlarged(false);
                  setZoomLevel(1);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <span>Close</span>
                <span className="text-[10px] text-slate-400 font-mono">Esc</span>
              </button>
            </div>
          </div>

          {/* Centered Scrollable Certificate Container */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <div
              className="relative inline-block transition-transform duration-200 origin-center max-w-full"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={certificate.imageUrl}
                alt={certificate.title}
                className="max-w-[92vw] max-h-[82vh] object-contain rounded-xl shadow-2xl border border-slate-800/80"
              />

              {/* Dynamic Frosted Glass Privacy Overlays on Enlarged View */}
              {blurZones.map((zone, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                  }}
                  className="absolute pointer-events-none rounded-lg backdrop-blur-md bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/60 shadow-sm flex items-center justify-center p-1 z-10"
                >
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-xs border border-white/20">
                    <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{zone.label || "Signature Redacted"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

