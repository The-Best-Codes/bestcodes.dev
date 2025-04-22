export default function relativeToAbsolute(
  relativePath: string | undefined,
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev";

  let absolutePath = relativePath;
  if (relativePath) {
    if (relativePath?.startsWith("/")) {
      absolutePath = siteUrl + relativePath;
    } else {
      absolutePath = `${siteUrl}/${relativePath}`;
    }
  } else {
    absolutePath = siteUrl;
  }

  return absolutePath;
}
