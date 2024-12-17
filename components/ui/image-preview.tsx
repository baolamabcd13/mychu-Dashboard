"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove: () => void;
}

export function ImagePreview({
  src,
  alt = "Preview",
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="relative w-full">
      <div className="relative w-full h-[200px]">
        <Image src={src} alt={alt} fill className="object-cover rounded-md" />
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
