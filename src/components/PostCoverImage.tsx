"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/images/logo-maigo79.png";

export default function PostCoverImage({
  src,
  alt,
  priority = false,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
}) {
  const [imageSource, setImageSource] = useState(src || FALLBACK_IMAGE);

  return (
    <Image
      src={imageSource}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
      onError={() => setImageSource(FALLBACK_IMAGE)}
    />
  );
}
