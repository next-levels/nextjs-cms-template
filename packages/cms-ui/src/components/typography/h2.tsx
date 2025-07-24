import type { HTMLAttributes } from "react";
import { cn } from "@mikestraczek/cms-core";

type H2Props = HTMLAttributes<HTMLHeadingElement>;

export function H2({ children, className, ...props }: H2Props) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
