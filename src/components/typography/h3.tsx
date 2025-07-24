import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type H3Props = HTMLAttributes<HTMLHeadingElement>;

export function H3({ children, className, ...props }: H3Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
