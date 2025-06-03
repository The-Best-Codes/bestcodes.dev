import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content");
const cacheDir = path.join(process.cwd(), ".blog-cache");
const slugsCacheFile = path.join(cacheDir, "slugs.json");

function getPostSlugs() {
  try {
    const files = fs.readdirSync(postsDir);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading post slugs during build:", error);
    return [];
  }
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
