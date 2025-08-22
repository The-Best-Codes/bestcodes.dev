#!/usr/bin/env node

import { program } from "commander";
import crypto from "crypto";
import { config } from "dotenv";

config();

const SIGNING_KEY = process.env.UNPUBLISHED_BLOG_SIGNING_KEY;

if (!SIGNING_KEY) {
  console.error(
    "❌ Error: UNPUBLISHED_BLOG_SIGNING_KEY environment variable is not set.",
  );
  console.error("Please add it to your .env file:");
  console.error('UNPUBLISHED_BLOG_SIGNING_KEY="$(openssl rand -base64 32)"');
  process.exit(1);
}

function generateSignedKey(customKey) {
  const key = customKey || crypto.randomBytes(6).toString("hex");

  if (customKey && (customKey.length < 4 || customKey.length > 20)) {
    throw new Error("Custom key must be between 4 and 20 characters");
  }

  const signature = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(key)
    .digest("hex")
    .substring(0, 16);

  return `${key}.${signature}`;
}

function generateMultipleKeys(count, length) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    const randomKey = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .substring(0, length);
    keys.push(generateSignedKey(randomKey));
  }
  return keys;
}

program
  .name("generate-blog-key")
  .description("Generate signed keys for accessing unpublished blog posts")
  .version("1.0.0");

program
  .command("single")
  .description("Generate a single signed key")
  .option("-k, --key <key>", "Custom key (4-20 characters, alphanumeric)")
  .option("-l, --length <length>", "Length of random key (4-20)", "10")
  .action((options) => {
    try {
      const length = parseInt(options.length);
      if (length < 4 || length > 20) {
        console.error("❌ Length must be between 4 and 20");
        process.exit(1);
      }

      let signedKey;
      if (options.key) {
        if (!/^[a-zA-Z0-9]+$/.test(options.key)) {
          console.error(
            "❌ Custom key must contain only alphanumeric characters",
          );
          process.exit(1);
        }
        signedKey = generateSignedKey(options.key);
        console.log("✅ Generated signed key with custom key:");
      } else {
        const randomKey = crypto
          .randomBytes(Math.ceil(length / 2))
          .toString("hex")
          .substring(0, length);
        signedKey = generateSignedKey(randomKey);
        console.log("✅ Generated signed key:");
      }

      console.log(`\n🔑 ${signedKey}\n`);
      console.log(
        "📋 Give this key to users to access unpublished blog posts.",
      );
      console.log(
        "⚠️  Keep this key secure - anyone with it can access unpublished content.",
      );
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("batch")
  .description("Generate multiple signed keys")
  .option("-c, --count <count>", "Number of keys to generate", "5")
  .option("-l, --length <length>", "Length of each random key (4-20)", "8")
  .action((options) => {
    try {
      const count = parseInt(options.count);
      const length = parseInt(options.length);

      if (count < 1 || count > 50) {
        console.error("❌ Count must be between 1 and 50");
        process.exit(1);
      }

      if (length < 4 || length > 20) {
        console.error("❌ Length must be between 4 and 20");
        process.exit(1);
      }

      const keys = generateMultipleKeys(count, length);

      console.log(`✅ Generated ${count} signed keys:\n`);
      keys.forEach((key, index) => {
        console.log(`${(index + 1).toString().padStart(2, "0")}. ${key}`);
      });

      console.log(
        "\n📋 Give these keys to users to access unpublished blog posts.",
      );
      console.log(
        "⚠️  Keep these keys secure - anyone with them can access unpublished content.",
      );
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("verify")
  .description("Verify if a signed key is valid")
  .argument("<key>", "The signed key to verify")
  .action((key) => {
    try {
      const [keyPart, signature] = key.split(".");
      if (!keyPart || !signature) {
        console.log("❌ Invalid key format. Expected format: key.signature");
        process.exit(1);
      }

      const expectedSignature = crypto
        .createHmac("sha256", SIGNING_KEY)
        .update(keyPart)
        .digest("hex")
        .substring(0, 16);

      if (signature === expectedSignature) {
        console.log("✅ Key is valid!");
        console.log(`🔑 Key part: ${keyPart}`);
        console.log(`🔏 Signature: ${signature}`);
      } else {
        console.log("❌ Key is invalid!");
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

if (process.argv.length <= 2) {
  program.help();
}

program.parse();
