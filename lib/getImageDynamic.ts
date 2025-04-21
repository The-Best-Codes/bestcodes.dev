"use server";
import fs from "fs";
import sharp from "sharp";

export default async function getDynamicImageAsStatic(
  imageUrl: string,
  relativePath: string,
) {
  const imagePath = `${relativePath}${imageUrl}`;
  const imageBuffer = await fs.promises.readFile(imagePath);
  const { width, height } = await sharp(imageBuffer).metadata();
  const blurWidthResize = width ? Math.round(width / 15) : 0;
  const blurHeightResize = height ? Math.round(height / 15) : 0;
  const resizedBuffer = await sharp(imageBuffer)
    .resize({ width: blurWidthResize, height: blurHeightResize })
    .toBuffer();
  const base64Blur = resizedBuffer.toString("base64");

  return {
    src: imageUrl,
    width: width || 0,
    height: height || 0,
    blurDataURL: `data:image/png;base64,${base64Blur}`,
    blurWidth: blurWidthResize,
    blurHeight: blurHeightResize,
  };
}

export async function getImageBlurURL(
  imagePath: string,
  blurWidth?: number,
  blurHeight?: number,
  blurQuality?: number,
) {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const { width, height } = await sharp(imageBuffer).metadata();
  const blurWidthResize = width ? Math.round(width / (blurQuality || 15)) : 0;
  const blurHeightResize = height
    ? Math.round(height / (blurQuality || 15))
    : 0;
  const resizedBuffer = await sharp(imageBuffer)
    .resize({
      width: blurWidth || blurWidthResize,
      height: blurHeight || blurHeightResize,
    })
    .toBuffer();
  const base64Blur = resizedBuffer.toString("base64");

  return `data:image/png;base64,${base64Blur}`;
}
