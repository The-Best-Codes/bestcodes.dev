import * as clack from "@clack/prompts";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  clack.log.error("GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}
const genAI = new GoogleGenAI({ apiKey });

async function generateAltText(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);

    const ext = path.extname(imagePath).toLowerCase();
    let mimeType;
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        mimeType = "image/jpeg";
        break;
      case ".png":
        mimeType = "image/png";
        break;
      case ".gif":
        mimeType = "image/gif";
        break;
      case ".webp":
        mimeType = "image/webp";
        break;
      default:
        clack.log.warn(
          `Unknown image type for ${imagePath}. Attempting to use binary.`,
        );
        mimeType = "application/octet-stream";
    }

    const base64Image = imageBuffer.toString("base64");

    const models = genAI.models;

    const prompt =
      "Generate alt text for this image, suitable for web accessibility and SEO. Focus on describing the content of the image accurately. Respond with the alt text as plain text with no other content or formatting.";

    const result = await models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { data: base64Image, mimeType } },
          ],
        },
      ],
    });

    const response = result.candidates?.[0]?.content?.parts?.[0];
    const text = response?.text;

    if (!text) {
      throw new Error("AI did not generate alt text.");
    }

    return text.trim();
  } catch (error) {
    clack.log.error(`Error generating alt text for ${imagePath}: ${error}`);
    return null;
  }
}

async function run() {
  clack.intro(`Let's generate image alts!`);

  const filePath = await clack.text({
    message: "Enter the path to the markdown or mdx file:",
    placeholder: "content/post.mdx",
    validate: (value) => {
      if (!value) return "File path is required.";
      if (!value.endsWith(".md") && !value.endsWith(".mdx"))
        return "File must be a .md or .mdx file.";
      return undefined;
    },
  });

  const imageBasePath = await clack.text({
    message: "Enter the optional base path for images (e.g., public):",
    placeholder: "e.g., public",
    initialValue: "",
  });

  const absoluteFilePath = path.resolve(filePath);

  try {
    const fileContent = await fs.readFile(absoluteFilePath, "utf-8");

    const imgRegex =
      /<img\s+[^>]*src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/g;
    const mdImgRegex = /!\[(.*?)\]\((.*?)\)/g;

    let match;
    const imagesInFile = [];

    while ((match = imgRegex.exec(fileContent)) !== null) {
      const originalTag = match[0];
      const src = match[1];
      const currentAlt = match[2] || "";
      const startIndex = match.index;
      imagesInFile.push({
        type: "html",
        originalTag,
        src,
        currentAlt,
        startIndex,
      });
    }

    while ((match = mdImgRegex.exec(fileContent)) !== null) {
      const originalTag = match[0];
      const currentAlt = match[1] || "";
      const src = match[2];
      const startIndex = match.index;
      imagesInFile.push({
        type: "markdown",
        originalTag,
        src,
        currentAlt,
        startIndex,
      });
    }

    if (imagesInFile.length === 0) {
      clack.outro(`No images found in ${filePath}.`);
      return;
    }

    imagesInFile.sort((a, b) => a.startIndex - b.startIndex);

    const uniqueImages = new Map();

    for (const img of imagesInFile) {
      let resolvedImagePath = img.src;

      if (
        !resolvedImagePath.startsWith("http") &&
        !resolvedImagePath.startsWith("/")
      ) {
        resolvedImagePath = path.resolve(
          path.dirname(absoluteFilePath),
          resolvedImagePath,
        );
      } else if (imageBasePath && !resolvedImagePath.startsWith("http")) {
        resolvedImagePath = path.join(imageBasePath, img.src);
      }

      if (resolvedImagePath.startsWith("http")) {
        clack.log.info(`Skipping web image: ${img.src}`);
        continue;
      }

      if (!uniqueImages.has(resolvedImagePath)) {
        uniqueImages.set(resolvedImagePath, {
          src: img.src,
          currentAlt: img.currentAlt,
          occurrences: [],
          generatedAlt: null,
        });
      }
      uniqueImages.get(resolvedImagePath).occurrences.push({
        type: img.type,
        originalTag: img.originalTag,
        startIndex: img.startIndex,
      });
    }

    if (uniqueImages.size === 0) {
      clack.outro(`No local or relative-path images found in ${filePath}.`);
      return;
    }

    const selectOptions = [];
    for (const [imagePath, imageData] of uniqueImages.entries()) {
      selectOptions.push({
        value: imagePath,
        label: imagePath,
        hint: `Current alt: "${imageData.currentAlt}"`,
      });
    }

    const selectedImagesForGen = await clack.multiselect({
      message: "Select images to generate alt text for:",
      options: selectOptions,
      required: true,
    });

    if (selectedImagesForGen.length === 0) {
      clack.outro(`No images selected. Exiting.`);
      return;
    }

    clack.log.info(
      `Generating alt text for ${selectedImagesForGen.length} selected images...`,
    );
    const s = clack.spinner();
    s.start();

    const generatedAlts = new Map();
    for (const imagePath of selectedImagesForGen) {
      const imageData = uniqueImages.get(imagePath);
      if (imageData) {
        s.message(`Generating for ${imagePath}...`);
        const altText = await generateAltText(imagePath);
        if (altText !== null) {
          generatedAlts.set(imagePath, altText);
          uniqueImages.get(imagePath).generatedAlt = altText;
        } else {
          clack.log.warn(`Failed to generate alt text for ${imagePath}.`);
        }
      }
    }

    s.stop("Alt text generation complete.");

    if (generatedAlts.size === 0) {
      clack.outro("No alt text was successfully generated. Exiting.");
      return;
    }

    clack.log.info("Generated Alt Texts:");
    for (const [imagePath, generatedAlt] of generatedAlts.entries()) {
      clack.log.info(`  ${imagePath}: "${generatedAlt}"`);
    }

    const confirmApply = await clack.confirm({
      message: `Apply these ${generatedAlts.size} generated alt texts to ${filePath}?`,
    });

    if (!confirmApply) {
      clack.outro("Changes not applied. Exiting.");
      return;
    }

    let modifiedContent = fileContent;
    let offset = 0;

    const imagesToUpdate = imagesInFile.filter((img) => {
      let resolvedPath = img.src;
      if (!resolvedPath.startsWith("http") && !resolvedPath.startsWith("/")) {
        resolvedPath = path.resolve(
          path.dirname(absoluteFilePath),
          resolvedPath,
        );
      } else if (imageBasePath && !resolvedPath.startsWith("http")) {
        resolvedPath = path.join(imageBasePath, img.src);
      }
      return generatedAlts.has(resolvedPath);
    });

    for (const img of imagesToUpdate) {
      let resolvedPath = img.src;
      if (!resolvedPath.startsWith("http") && !resolvedPath.startsWith("/")) {
        resolvedPath = path.resolve(
          path.dirname(absoluteFilePath),
          resolvedPath,
        );
      } else if (imageBasePath && !resolvedPath.startsWith("http")) {
        resolvedPath = path.join(imageBasePath, img.src);
      }
      const newAlt = generatedAlts.get(resolvedPath);
      const originalTag = img.originalTag;
      const startIndex = img.startIndex + offset;

      let newTag;
      if (img.type === "html") {
        newTag = originalTag;
        const altMatch = originalTag.match(/alt=["']([^"']*)["']/);

        if (altMatch) {
          newTag = originalTag.replace(altMatch[0], `alt="${newAlt}"`);
        } else {
          const closeTagMatch = newTag.match(/\/?\s*>$/);
          if (closeTagMatch) {
            const insertIndex = closeTagMatch.index;
            newTag =
              newTag.slice(0, insertIndex) +
              ` alt="${newAlt}"` +
              newTag.slice(insertIndex);
          } else {
            newTag = newTag.slice(0, newTag.length - 1) + ` alt="${newAlt}">`;
          }
        }
      } else if (img.type === "markdown") {
        newTag = `![${newAlt}](${img.src})`;
      } else {
        clack.log.warn(
          `Unknown image type encountered: ${img.type}. Skipping update for this image.`,
        );
        continue;
      }

      modifiedContent =
        modifiedContent.substring(0, startIndex) +
        newTag +
        modifiedContent.substring(startIndex + originalTag.length);

      offset += newTag.length - originalTag.length;
    }

    await fs.writeFile(absoluteFilePath, modifiedContent, "utf-8");

    clack.outro(
      `Successfully updated alt text for ${generatedAlts.size} images in ${filePath}.`,
    );
  } catch (error) {
    clack.log.error(`An error occurred: ${error}`);
    clack.outro(`Process failed.`);
  }
}

run();
