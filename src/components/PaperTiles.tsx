import React, { useState } from "react";
import { motion } from "motion/react";

interface PaperTilesProps {
  src: string;
  alt: string;
  stripsCount?: number;
  className?: string;
  aspectClassName?: string;
  overlayBadge?: string;
  tag?: string;
}

export default function PaperTiles({
  src,
  alt,
  stripsCount = 4,
  className = "",
  aspectClassName = "aspect-[16/11]",
  overlayBadge,
  tag,
}: PaperTilesProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Each strip gets subtle alternating offsets and durations
  const stripHeightsPercent = 100 / stripsCount;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none overflow-hidden bg-[#EAEAE5] border border-[#E2E2DC] shadow-[0_4px_24px_rgba(17,19,24,0.06)] ${className}`}
    >
      <div className={`relative w-full ${aspectClassName} overflow-hidden`}>
        {Array.from({ length: stripsCount }).map((_, index) => {
          const isEven = index % 2 === 0;
          const topPercent = index * stripHeightsPercent;
          
          // Subtle horizontal shifts and 0.8-1.5 degree tilt
          const baseShift = isEven ? -4 : 4;
          const hoverShift = isEven ? -12 : 12;
          const baseRotate = isEven ? -0.7 : 0.8;
          const hoverRotate = isEven ? -1.6 : 1.6;

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                x: isHovered ? hoverShift : [baseShift, -baseShift, baseShift],
                rotate: isHovered ? hoverRotate : [baseRotate, -baseRotate, baseRotate],
                scale: isHovered ? 1.01 : 1,
              }}
              transition={
                isHovered
                  ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                  : {
                      duration: 6 + index * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4,
                    }
              }
              style={{
                position: "absolute",
                top: `${topPercent}%`,
                left: 0,
                width: "100%",
                height: `${stripHeightsPercent + 0.5}%`, // slight overlap to prevent gaps
                overflow: "hidden",
                zIndex: index + 1,
                borderBottom: index < stripsCount - 1 ? "1px solid rgba(226, 222, 214, 0.75)" : "none",
                boxShadow: isHovered ? "0 4px 12px rgba(17,19,24,0.07)" : "none",
              }}
            >
              {/* Internal image shifted to align vertically */}
              <div
                style={{
                  position: "absolute",
                  top: `-${index * 100}%`,
                  left: 0,
                  width: "100%",
                  height: `${stripsCount * 100}%`,
                }}
              >
                <img
                  src={src}
                  alt={`${alt} - strip ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Architectural line watermark on top strip */}
              {index === 0 && tag && (
                <div className="absolute top-2 left-3 z-10">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 bg-[#F4F4F0]/90 backdrop-blur-sm border border-[#E2E2DC] text-[#555B63]">
                    {tag}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Paper texture and subtle grain wash */}
        <div className="absolute inset-0 pointer-events-none z-20 mix-blend-multiply bg-[#F4F4F0]/10" />

        {/* Technical corner coordinate markings */}
        <div className="absolute top-2 right-2 z-30 font-mono text-[8px] text-[#555B63] bg-[#F4F4F0]/85 px-1.5 py-0.5 border border-[#E2E2DC]">
          FIG.{stripsCount}·P
        </div>
      </div>

      {overlayBadge && (
        <div className="px-4 py-2 border-t border-[#E2E2DC] bg-[#FAF9F5] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#555B63]">
            {overlayBadge}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]" />
        </div>
      )}
    </div>
  );
}
