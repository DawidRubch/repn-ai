CREATE TABLE IF NOT EXISTS "meetings_booked" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "usage_minutes";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meetings_booked" ADD CONSTRAINT "meetings_booked_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
