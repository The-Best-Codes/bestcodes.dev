import fs from "fs";
import path from "path";
import sharp from "sharp";

// Builds a next/image static import object (with a tiny blur placeholder) for a
// file in /public, e.g. "/image/blog/foo.png".
export default async function getDynamicImageAsStatic(imageUrl: string) {
  const image = sharp(
    await fs.promises.readFile(path.join(process.cwd(), "public", imageUrl)),
  );
  const { width = 0, height = 0 } = await image.metadata();
  const blurWidth = Math.max(1, Math.round(width / 15));
  const blurHeight = Math.max(1, Math.round(height / 15));
  const blur = await image.resize(blurWidth, blurHeight).png().toBuffer();

  return {
    src: imageUrl,
    width,
    height,
    blurDataURL: `data:image/png;base64,${blur.toString("base64")}`,
    blurWidth,
    blurHeight,
  };
}
