// Editorial-style input with only a bottom border. Used for guide titles,
// place names, and other "this looks like a headline" form fields.

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface BorderlessInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** "title" → 34px, "name" → 22px, "small" → 14px */
  variant?: "title" | "name" | "small";
}

export const BorderlessInput = forwardRef<HTMLInputElement, BorderlessInputProps>(
  function BorderlessInput({ variant = "small", className, ...rest }, ref) {
    const sizeClass =
      variant === "title"
        ? "text-[34px] leading-[1.1]"
        : variant === "name"
          ? "text-[22px] leading-[1.2]"
          : "text-[14px] leading-[1.5]";
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-ink outline-none focus:border-ink",
          sizeClass,
          className,
        )}
        style={{ letterSpacing: variant === "title" ? "-0.02em" : undefined }}
        {...rest}
      />
    );
  },
);
