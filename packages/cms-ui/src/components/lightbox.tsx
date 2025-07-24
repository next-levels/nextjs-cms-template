"use client";

import * as React from "react";

import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type LightboxProps = {
  children: React.ReactNode;
  src: string;
  alt: string;
  className?: string;
  description?: string;
};

export function Lightbox({
  children,
  src,
  alt,
  className,
  description,
}: LightboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn("group relative cursor-pointer", className)}>
          {children}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
            <ZoomIn className="size-6 -translate-y-10 scale-0 text-white drop-shadow-lg transition-transform duration-200 group-hover:translate-y-0 group-hover:scale-100" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="z-50 h-full w-full sm:max-h-[90vh] sm:max-w-[90vw]"
        aria-describedby={alt}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative flex flex-col items-center justify-center gap-4">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="h-full w-auto object-contain"
            priority
          />

          {description && <DialogDescription>{description}</DialogDescription>}

          <DialogClose className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:outline-none">
            <X className="size-4" />
            <span className="sr-only">Schließen</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
