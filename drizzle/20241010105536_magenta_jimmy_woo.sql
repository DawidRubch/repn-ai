DO $$ BEGIN
 CREATE TYPE "public"."position" AS ENUM('left', 'right', 'center');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "critical_knowledge_files";--> statement-breakpoint
DROP TABLE "google_calendar_tokens";