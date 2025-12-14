CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'BASIC');--> statement-breakpoint
CREATE TABLE "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"description" text,
	"date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_id" uuid NOT NULL,
	"path" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"photo_path" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"photo_path" text,
	"role" "user_role" DEFAULT 'BASIC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_lowercase" CHECK ("profiles"."username" = lower("profiles"."username")),
	CONSTRAINT "profiles_username_chars" CHECK ("profiles"."username" ~ '^[a-z0-9_.]+$'),
	CONSTRAINT "profiles_username_length" CHECK (length("profiles"."username") BETWEEN 3 AND 20),
	CONSTRAINT "profiles_username_reserved" CHECK ("profiles"."username" NOT IN ('admin', 'support', 'root', 'login', 'signup', 'me'))
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_log_id_logs_id_fk" FOREIGN KEY ("log_id") REFERENCES "public"."logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "logs_plant_id_idx" ON "logs" USING btree ("plant_id");--> statement-breakpoint
CREATE INDEX "logs_user_id_date_idx" ON "logs" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "photos_log_id_idx" ON "photos" USING btree ("log_id");--> statement-breakpoint
CREATE UNIQUE INDEX "photos_log_id_order_unique" ON "photos" USING btree ("log_id","order");--> statement-breakpoint
CREATE INDEX "plants_user_id_idx" ON "plants" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_unique" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE POLICY "logs_public_select" ON "logs" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "logs_public_select_auth" ON "logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "logs_insert_own" ON "logs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        "logs"."user_id" = auth.uid()
        AND EXISTS (
          SELECT 1 FROM plants p
          WHERE p.id = "logs"."plant_id"
            AND p.user_id = auth.uid()
        )
      );--> statement-breakpoint
CREATE POLICY "logs_update_own" ON "logs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("logs"."user_id" = auth.uid()) WITH CHECK ("logs"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "logs_delete_own" ON "logs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("logs"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "photos_public_select" ON "photos" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "photos_public_select_auth" ON "photos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "photos_insert_own" ON "photos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = auth.uid()
        )
      );--> statement-breakpoint
CREATE POLICY "photos_update_own" ON "photos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = auth.uid()
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = auth.uid()
        )
      );--> statement-breakpoint
CREATE POLICY "photos_delete_own" ON "photos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = auth.uid()
        )
      );--> statement-breakpoint
CREATE POLICY "plants_public_select" ON "plants" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "plants_public_select_auth" ON "plants" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "plants_insert_own" ON "plants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("plants"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "plants_update_own" ON "plants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("plants"."user_id" = auth.uid()) WITH CHECK ("plants"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "plants_delete_own" ON "plants" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("plants"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "profiles_public_select" ON "profiles" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "profiles_public_select_auth" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "profiles_insert_own" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("profiles"."id" = auth.uid());--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profiles"."id" = auth.uid()) WITH CHECK ("profiles"."id" = auth.uid());--> statement-breakpoint
CREATE POLICY "profiles_delete_own" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("profiles"."id" = auth.uid());