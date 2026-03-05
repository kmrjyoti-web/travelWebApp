// Class name utility (no tailwind-merge since NO Tailwind in this project)
// Filters out falsy values and joins class names
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
