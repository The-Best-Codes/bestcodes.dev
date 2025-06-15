import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content");
const cacheDir = path.join(process.cwd(), ".blog-cache");
const slugsCacheFile = path.join(cacheDir, "slugs.json");

function getPostSlugs() {
  try {
    return getPostSlugsRecursive(postsDir, "");
  } catch (error) {
    console.error("Error reading post slugs during build:", error);
    return [];
  }
}

function getPostSlugsRecursive(dir, relativePath) {
  const slugs = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const currentRelativePath = relativePath
      ? path.join(relativePath, item.name)
      : item.name;

    if (item.isDirectory()) {
      // Recursively scan subdirectories
      slugs.push(...getPostSlugsRecursive(fullPath, currentRelativePath));
    } else if (item.isFile() && item.name.endsWith(".mdx")) {
      // Convert file path to slug (remove .mdx extension and normalize path separators)
      const slug = currentRelativePath
        .replace(/\.mdx$/, "")
        .replace(/\\/g, "/");
      slugs.push(slug);
    }
  }

  return slugs;
}

async function generateSlugsCache() {
  console.log("Generating blog slugs cache...");
  const slugs = getPostSlugs();

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  fs.writeFileSync(slugsCacheFile, JSON.stringify(slugs, null, 2), "utf-8");

  console.log(`Blog slugs cache generated at ${slugsCacheFile}`);
  console.log(`Found ${slugs.length} slugs.`);
}

generateSlugsCache().catch(console.error);
