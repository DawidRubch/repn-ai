ALTER TABLE "agents" RENAME COLUMN "intro_message" TO "intro_message ";--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "websites" text[];