export function withBasePath(src: string | null | undefined): string | null {
  if (!src) return null;
  // If it's an absolute URL (http, https, data, blob), return as-is
  if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  const baseRaw = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const base = baseRaw.replace(/\/$/, ''); // remove trailing slash
  // Ensure src starts with a single leading slash
  const path = src.startsWith('/') ? src : `/${src}`;
  if (!base) return path;
  // Avoid double-prefixing if already contains base
  if (path.startsWith(`${base}/`) || path === base) return path;
  return `${base}${path}`;
}
