const optimizableImagePattern = /\.(png|jpe?g|webp)(\?.*)?$/i;

function replaceExtensionWithWebp(path: string) {
  return path.replace(/\.(png|jpe?g|webp)$/i, '.webp');
}

export function getOptimizedImageSrc(src: string) {
  if (!optimizableImagePattern.test(src)) {
    return src;
  }

  const [pathWithoutQuery] = src.split('?');
  const normalizedPath = pathWithoutQuery ?? src;
  const assetPrefixMatch = normalizedPath.match(/^(.*?)(assets\/)(.+)$/);

  if (!assetPrefixMatch) {
    return src;
  }

  const [, basePath, assetPrefix, assetPath] = assetPrefixMatch;
  return `${basePath}${assetPrefix}generated/thumbs/${replaceExtensionWithWebp(assetPath)}`;
}
