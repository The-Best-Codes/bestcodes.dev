import chalk from "chalk";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const TITLE_MIN_LENGTH = 35;
const TITLE_MAX_LENGTH = 70;
const DESCRIPTION_MIN_LENGTH = 30;
const DESCRIPTION_MAX_LENGTH = 160;
const IMAGE_ALT_MIN_LENGTH = 10;
const IMAGE_ALT_MAX_LENGTH = 125;
const MAX_TAGS = 4;
const VALID_TAG_REGEX = /^[a-zA-Z0-9_-]+$/;

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getMarkdownFiles(inputPath) {
  const stats = await fs.stat(inputPath);
  if (stats.isFile()) {
    if (inputPath.endsWith(".md") || inputPath.endsWith(".mdx")) {
      return [inputPath];
    } else {
      console.error(
        chalk.red(`Error: Input file must be a .md or .mdx file: ${inputPath}`),
      );
      return [];
    }
  } else if (stats.isDirectory()) {
    const files = await fs.readdir(inputPath);
    const markdownFiles = [];
    for (const file of files) {
      const filePath = path.join(inputPath, file);
      if (filePath.endsWith(".md") || filePath.endsWith(".mdx")) {
        markdownFiles.push(filePath);
      }
    }
    return markdownFiles;
  } else {
    console.error(
      chalk.red(
        `Error: Input path is neither a file nor a directory: ${inputPath}`,
      ),
    );
    return [];
  }
}

async function checkUrlStatus(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function validateFrontmatter(data, errors) {
  if (!data.title) {
    errors.push('Frontmatter: Missing "title" field.');
  } else {
    if (data.title.length < TITLE_MIN_LENGTH) {
      errors.push(
        `Frontmatter: "title" is too short (${data.title.length} chars), minimum ${TITLE_MIN_LENGTH}.`,
      );
    }
    if (data.title.length > TITLE_MAX_LENGTH) {
      errors.push(
        `Frontmatter: "title" is too long (${data.title.length} chars), maximum ${TITLE_MAX_LENGTH}.`,
      );
    }
  }

  if (!data.description) {
    errors.push('Frontmatter: Missing "description" field.');
  } else {
    if (data.description.length < DESCRIPTION_MIN_LENGTH) {
      errors.push(
        `Frontmatter: "description" is too short (${data.description.length} chars), minimum ${DESCRIPTION_MIN_LENGTH}.`,
      );
    }
    if (data.description.length > DESCRIPTION_MAX_LENGTH) {
      errors.push(
        `Frontmatter: "description" is too long (${data.description.length} chars), maximum ${DESCRIPTION_MAX_LENGTH}.`,
      );
    }
  }

  if (!data.date || !data.date.created) {
    errors.push('Frontmatter: Missing "date.created" field.');
  } else {
    const createdDate = new Date(data.date.created);
    if (isNaN(createdDate.getTime())) {
      errors.push(
        `Frontmatter: Invalid "date.created" format: "${data.date.created}". Use YYYY-MM-DD.`,
      );
    }
    if (data.date.updated) {
      const updatedDate = new Date(data.date.updated);
      if (isNaN(updatedDate.getTime())) {
        errors.push(
          `Frontmatter: Invalid "date.updated" format: "${data.date.updated}". Use YYYY-MM-DD.`,
        );
      } else if (!isNaN(createdDate.getTime()) && createdDate > updatedDate) {
        errors.push(
          `Frontmatter: "date.created" (${data.date.created}) is after "date.updated" (${data.date.updated}). Created date should be older or same.`,
        );
      }
    }
  }

  if (!data.author || !data.author.name) {
    errors.push('Frontmatter: Missing "author.name" field.');
  }

  if (!data.image) {
    errors.push('Frontmatter: Missing "image" object.');
  } else {
    if (!data.image.url) {
      errors.push('Frontmatter: Missing "image.url" field.');
    } else {
      const isExternal = data.image.external === true;
      if (!data.image.url.startsWith("/") && !isExternal) {
        errors.push(
          `Frontmatter: "image.url" ("${data.image.url}") does not start with '/' and "image.external" is not true.`,
        );
      }
    }
    if (!data.image.alt) {
      errors.push('Frontmatter: Missing "image.alt" field.');
    } else {
      if (data.image.alt.length < IMAGE_ALT_MIN_LENGTH) {
        errors.push(
          `Frontmatter: "image.alt" is too short (${data.image.alt.length} chars), minimum ${IMAGE_ALT_MIN_LENGTH}.`,
        );
      }
      if (data.image.alt.length > IMAGE_ALT_MAX_LENGTH) {
        errors.push(
          `Frontmatter: "image.alt" is too long (${data.image.alt.length} chars), maximum ${IMAGE_ALT_MAX_LENGTH}.`,
        );
      }
    }
    if (!data.image.fit) {
      errors.push('Frontmatter: Missing "image.fit" field (e.g., "contain").');
    }
  }

  if (!data.tags || !Array.isArray(data.tags)) {
    errors.push(
      'Frontmatter: Missing or invalid "tags" field. Must be an array.',
    );
  } else {
    if (data.tags.length === 0) {
      errors.push(
        'Frontmatter: "tags" array is empty. Please add at least one tag.',
      );
    }
    if (data.tags.length > MAX_TAGS) {
      errors.push(
        `Frontmatter: Too many tags (${data.tags.length}), maximum ${MAX_TAGS}.`,
      );
    }
    data.tags.forEach((tag, index) => {
      if (typeof tag !== "string") {
        errors.push(
          `Frontmatter: Tag at index ${index} is not a string: "${tag}".`,
        );
      } else if (!VALID_TAG_REGEX.test(tag)) {
        errors.push(
          `Frontmatter: Tag "${tag}" at index ${index} contains invalid characters. Use letters, numbers, -, and _.`,
        );
      }
    });
  }
}

async function validateMarkdownContent(content, errors) {
  const processor = remark().use(remarkParse);
  const tree = processor.parse(content);

  const externalLinks = [];

  visit(tree, (node) => {
    if (node.type === "image") {
      if (!node.alt) {
        errors.push(
          `Content: Image is missing alt text at line ${node.position.start.line}.`,
        );
      } else {
        if (node.alt.length < IMAGE_ALT_MIN_LENGTH) {
          errors.push(
            `Content: Image alt text is too short ("${node.alt}", ${node.alt.length} chars) at line ${node.position.start.line}, minimum ${IMAGE_ALT_MIN_LENGTH}.`,
          );
        }
        if (node.alt.length > IMAGE_ALT_MAX_LENGTH) {
          errors.push(
            `Content: Image alt text is too long ("${node.alt}", ${node.alt.length} chars) at line ${node.position.start.line}, maximum ${IMAGE_ALT_MAX_LENGTH}.`,
          );
        }
      }
    }

    if (node.type === "link") {
      if (!node.url) {
        errors.push(
          `Content: Link is missing URL at line ${node.position.start.line}.`,
        );
      } else if (
        node.url.startsWith("http://") ||
        node.url.startsWith("https://")
      ) {
        externalLinks.push({ url: node.url, line: node.position.start.line });
      }
    }
  });

  const linkCheckPromises = externalLinks.map(async (link) => {
    const isAlive = await checkUrlStatus(link.url);
    return { link, isAlive };
  });

  const linkCheckResults = await Promise.all(linkCheckPromises);

  for (const result of linkCheckResults) {
    if (!result.isAlive) {
      errors.push(
        `Content: External link appears broken or unreachable ("${result.link.url}") at line ${result.link.line}.`,
      );
    }
  }
}

async function lintFile(filePath) {
  const errors = [];

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    validateFrontmatter(data, errors);

    await validateMarkdownContent(content, errors);
  } catch (error) {
    errors.push(`Failed to process file: ${error.message}`);
  }

  return errors;
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("path", {
      alias: "p",
      description:
        "Path to a blog post directory or a specific file (e.g., content/ or content/post.mdx)",
      type: "string",
      demandOption: true,
    })
    .help()
    .alias("h", "help").argv;

  const inputPath = argv.path;

  const pathExists = await checkFileExists(inputPath);
  if (!pathExists) {
    console.error(chalk.red(`Error: Input path does not exist: ${inputPath}`));
    process.exit(1);
  }

  const markdownFiles = await getMarkdownFiles(inputPath);

  if (markdownFiles.length === 0) {
    console.warn(
      chalk.yellow(
        `No .md or .mdx files found at the specified path: ${inputPath}`,
      ),
    );
    process.exit(0);
  }

  console.log(
    chalk.blue(`\nStarting linting for ${markdownFiles.length} file(s)...`),
  );

  const lintingPromises = markdownFiles.map((filePath) => lintFile(filePath));

  const fileResults = await Promise.all(lintingPromises);

  let successfulCount = 0;
  let failedCount = 0;

  console.log(chalk.cyan("\n--- Detailed Results ---"));

  fileResults.forEach((errors, index) => {
    const filePath = markdownFiles[index];
    if (errors.length > 0) {
      failedCount++;
      console.error(chalk.red(`\nErrors found in ${filePath}:`));
      errors.forEach((err) => console.error(chalk.white(`  - ${err}`)));
    } else {
      successfulCount++;
      console.log(chalk.green(`\nNo issues found in ${filePath}.`));
    }
  });

  console.log(chalk.cyan("\n--- Summary ---"));
  console.log(chalk.cyan(`Files processed: ${markdownFiles.length}`));
  console.log(chalk.green(`Files with no issues: ${successfulCount}`));
  console.error(chalk.red(`Files with errors: ${failedCount}`));

  if (failedCount > 0) {
    console.error(
      chalk.red(
        "\nSome linting checks failed. Please review the errors above.",
      ),
    );
    process.exit(1);
  } else {
    console.log(chalk.green("\nAll linting checks passed!"));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(chalk.red("An unexpected error occurred:"), err);
  process.exit(1);
});
