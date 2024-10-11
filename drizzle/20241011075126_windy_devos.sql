ALTER TABLE "agents" ADD COLUMN "show_calendar" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" DROP COLUMN IF EXISTS "websites";