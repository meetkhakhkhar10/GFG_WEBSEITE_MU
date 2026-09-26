import React, { useState } from "react";

export type EditorialImageVariant =
  | "photo"
  | "poster"
  | "hero"
  | "thumbnail"
  | "portrait"
  | "gallery";

export interface EditorialImageProps {
  src: string;
  alt: string;
  variant?: EditorialImageVariant;

  // Header Bar Above Frame
  headerLeft?: string;
  headerRight?: string;

  // Inner Badges & Labels
  figLabel?: string;
  figNumber?: string;
  badge?: string;
  caption?: string;
  showGreenDot?: boolean;

  // Sizing & Framing
  aspectClassName?: string;
  className?: string;

  // Positioning & Fit
  objectFit?: "cover" | "contain";
  objectPosition?: string;

  // Slicing (Defaults to FALSE)
  enableSlicing?: boolean;
  stripsCount?: number;

  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: () => void;
}

export default function EditorialImage({
  src,
  alt,
  variant = "photo",
  headerLeft,
  headerRight,
  figLabel,
  figNumber,
  badge,
  caption,
  showGreenDot = true,
  aspectClassName = "aspect-[16/10]",
  className = "",
  objectFit,
  objectPosition,
  enableSlicing = false,
  stripsCount = 4,
  referrerPolicy = "no-referrer",
  onClick,
}: EditorialImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine effective object-fit
  const fitMode =
    objectFit !== undefined
      ? objectFit
      : variant === "poster"
      ? "contain"
      : "cover";

  // Determine object-position
  const positionMode =
    objectPosition ||
    (variant === "portrait"
      ? "object-top"
      : variant === "hero"
      ? "object-center"
      : "object-center");

  // Effective Inner Badge (e.g., ACADEMIC HUB, CAMPUS LABS)
  const topBadge = badge || figLabel;

  // Effective Top-Right Badge (e.g., FIG.4-P, FIG.01)
  const topRightBadge = figNumber;

  return (
    <div className={`editorial-image-root flex flex-col space-y-2 ${className}`}>
      {/* Outer Top Header Bar (if present) */}
      {(headerLeft || headerRight) && (
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8B9198] px-0.5">
          <span>{headerLeft}</span>
          {headerRight && <span className="text-[#00A86B] font-bold">{headerRight}</span>}
        </div>
      )}

      {/* Main Image Stage / Frame */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={`editorial-image-frame relative overflow-hidden bg-[#FAF9F5] border border-[#E2E2DC] shadow-[0_4px_20px_rgba(17,19,24,0.03)] group transition-all duration-300 ${aspectClassName} ${
          onClick ? "cursor-pointer hover:border-[#111318]" : ""
        }`}
      >
        {/* Very Subtle Film Grain Overlay */}
        <div className="editorial-image-texture pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-multiply bg-[radial-gradient(#111318_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Image Stage Container */}
        <div className="image-stage w-full h-full flex items-center justify-center relative bg-[#FAF9F5]">
          <img
            src={src}
            alt={alt}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full block transition-transform duration-500 ${
              fitMode === "contain" ? "object-contain p-2" : "object-cover"
            } ${positionMode} ${
              isHovered ? "scale-[1.015]" : "scale-100"
            } ${imageLoaded ? "opacity-100" : "opacity-90"}`}
            referrerPolicy={referrerPolicy}
            loading="lazy"
          />
        </div>

        {/* Inner Top-Left Badge (e.g. ACADEMIC HUB) */}
        {topBadge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="font-satoshi text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#E2E2DC] text-[#111318] shadow-sm block">
              {topBadge}
            </span>
          </div>
        )}

        {/* Inner Top-Right Badge (e.g. FIG.4-P) */}
        {topRightBadge && (
          <div className="absolute top-3 right-3 z-20">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#E2E2DC] text-[#555B63] shadow-sm block">
              {topRightBadge}
            </span>
          </div>
        )}

        {/* Bottom Caption Bar inside Image Container if caption is provided */}
        {caption && (
          <div className="absolute bottom-0 inset-x-0 z-20 bg-[#FFFFFF]/90 backdrop-blur-sm border-t border-[#E2E2DC] px-3 py-2 flex items-center justify-between">
            <span className="font-satoshi text-[9px] font-medium uppercase tracking-[0.15em] text-[#555B63] truncate pr-2">
              {caption}
            </span>
            {showGreenDot && (
              <span className="w-2 h-2 rounded-full bg-[#00A86B] shrink-0 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
