import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Role table
export const roles = pgTable("roles", {
  userId: varchar("userId", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  canDelete: boolean("canDelete").notNull(),
});

// Post metrics table (aggregated views/likes per post)
export const postMetrics = pgTable("post_metrics", {
  slug: varchar("slug", { length: 256 }).primaryKey(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Post likes table (tracks who liked what; supports user or anonymous fingerprint)
export const postLikes = pgTable(
  "post_likes",
  {
    id: serial("id").primaryKey().notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    userId: text("user_id"),
    fingerprint: text("fingerprint"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("post_likes_slug_idx").on(table.slug),
    // Soft uniqueness for authenticated users
    uniqueIndex("post_likes_slug_user_unique")
      .on(table.slug, table.userId)
      .where(sql`user_id IS NOT NULL`),
    // Soft uniqueness for anonymous fingerprints
    uniqueIndex("post_likes_slug_fingerprint_unique")
      .on(table.slug, table.fingerprint)
      .where(sql`fingerprint IS NOT NULL`),
  ],
);

// Comment table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey().notNull(),
  page: varchar("page", { length: 256 }).notNull(),
  thread: integer("thread"),
  author: varchar("author", { length: 256 }).notNull(),
  content: json("content").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Rate table
export const rates = pgTable(
  "rates",
  {
    userId: varchar("userId", { length: 256 }).notNull(),
    commentId: integer("commentId").notNull(),
    like: boolean("like").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.commentId] }),
    index("comment_idx").on(table.commentId),
  ],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
