ALTER TABLE "agents" ADD COLUMN "position" "position" DEFAULT 'right' NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "intro_message" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_url" text;