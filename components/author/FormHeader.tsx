import type { ReactNode } from "react";

interface FormHeaderProps {
  /** Left slot — typically a Cancel link or back chevron. */
  left: ReactNode;
  /** Center slot — uppercase eyebrow title. */
  title: string;
  /** Right slot — Save submit button or similar. */
  right?: ReactNode;
}

// Sticky header that sits at the top of the center column inside
// AuthorShell. Replaces the page-level NavBar that detail/form pages
// used before they were wrapped by the shell. Same anatomy: left action,
// centered uppercase eyebrow, right action.
export function FormHeader({ left, title, right }: FormHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-bg px-5 py-3 sm:px-7">
      <div className="flex min-w-[60px] items-center">{left}</div>
      <span
        className="font-serif text-[10px] uppercase text-faint"
        style={{ letterSpacing: "0.14em" }}
      >
        {title}
      </span>
      <div className="flex min-w-[60px] items-center justify-end">{right}</div>
    </div>
  );
}
