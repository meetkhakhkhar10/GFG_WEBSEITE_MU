import React from "react";
import EditorialImage from "./EditorialImage";

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
  return (
    <EditorialImage
      src={src}
      alt={alt}
      variant="photo"
      stripsCount={stripsCount}
      figLabel={tag || "CAMPUS OVERVIEW"}
      figNumber="FIG. 01"
      badge={tag}
      caption={overlayBadge}
      aspectClassName={aspectClassName}
      className={className}
    />
  );
}
