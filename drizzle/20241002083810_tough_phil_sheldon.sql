CREATE TABLE IF NOT EXISTS "agents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text NOT NULL,
	"greeting" text NOT NULL,
	"prompt" text NOT NULL,
	"critical_knowledge" text NOT NULL,
	"visibility" "visibility" NOT NULL,
	"answer_only_from_critical_knowledge" boolean NOT NULL,
	"avatar_photo_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "critical_knowledge_files" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "critical_knowledge_files" ADD CONSTRAINT "critical_knowledge_files_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
