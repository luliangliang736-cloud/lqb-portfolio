export function toAssetPath(path: string) {
  if (!path.startsWith('/assets/')) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  return `${baseUrl}${path.slice(1)}`;
}
