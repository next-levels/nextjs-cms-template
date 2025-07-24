import type { HTMLAttributes } from "react";
import { cn } from "@mikestraczek/cms-core";

type H1Props = HTMLAttributes<HTMLHeadingElement>;

export function H1({ children, className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
