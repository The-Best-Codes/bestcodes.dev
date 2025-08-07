CREATE TABLE "post_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"user_id" text,
	"fingerprint" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_metrics" (
	"slug" varchar(256) PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DROP INDEX "comment_idx";--> statement-breakpoint
CREATE INDEX "post_likes_slug_idx" ON "post_likes" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "post_likes_slug_user_unique" ON "post_likes" USING btree ("slug","user_id") WHERE user_id IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "post_likes_slug_fingerprint_unique" ON "post_likes" USING btree ("slug","fingerprint") WHERE fingerprint IS NOT NULL;--> statement-breakpoint
CREATE INDEX "comment_idx" ON "rates" USING btree ("commentId");