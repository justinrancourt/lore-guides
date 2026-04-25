// Slug generator for guides. Format per PRD:
//   {author_first_name}-{title_slugified}     e.g. "justin-valencia"
// Numeric suffix on collision: "justin-valencia-2", "-3", etc.
// Atomicity is handled by the caller via a unique-constraint retry loop.

const FIRST_NAME_FALLBACK = "guide";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")     // strip accents
    .replace(/[^a-z0-9]+/g, "-")          // non-alnum → dash
    .replace(/^-+|-+$/g, "")              // trim leading/trailing
    .replace(/-{2,}/g, "-");              // collapse runs
}

function firstNameSlug(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0] ?? "";
  return slugify(first) || FIRST_NAME_FALLBACK;
}

export function baseSlug(displayName: string, title: string): string {
  const base = `${firstNameSlug(displayName)}-${slugify(title)}`;
  return base.replace(/-+$/, "") || FIRST_NAME_FALLBACK;
}

export function withSuffix(base: string, attempt: number): string {
  // attempt 0 = bare base; 1+ = base-2, base-3, …
  return attempt === 0 ? base : `${base}-${attempt + 1}`;
}
