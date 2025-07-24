import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type H4Props = HTMLAttributes<HTMLHeadingElement>;

export function H4({ children, className, ...props }: H4Props) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}
