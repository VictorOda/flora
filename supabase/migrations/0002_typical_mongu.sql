ALTER POLICY "logs_insert_own" ON "logs" TO authenticated WITH CHECK (
        "logs"."user_id" = (select auth.uid())
        AND EXISTS (
          SELECT 1 FROM plants p
          WHERE p.id = "logs"."plant_id"
            AND p.user_id = (select auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "logs_update_own" ON "logs" TO authenticated USING ("logs"."user_id" = (select auth.uid())) WITH CHECK ("logs"."user_id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "logs_delete_own" ON "logs" TO authenticated USING ("logs"."user_id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "photos_insert_own" ON "photos" TO authenticated WITH CHECK (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = (select auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "photos_update_own" ON "photos" TO authenticated USING (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = (select auth.uid())
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = (select auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "photos_delete_own" ON "photos" TO authenticated USING (
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = "photos"."log_id"
            AND l.user_id = (select auth.uid())
        )
      );--> statement-breakpoint
ALTER POLICY "plants_insert_own" ON "plants" TO authenticated WITH CHECK ("plants"."user_id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "plants_update_own" ON "plants" TO authenticated USING ("plants"."user_id" = (select auth.uid())) WITH CHECK ("plants"."user_id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "plants_delete_own" ON "plants" TO authenticated USING ("plants"."user_id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "profiles_insert_own" ON "profiles" TO authenticated WITH CHECK ("profiles"."id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "profiles_update_own" ON "profiles" TO authenticated USING ("profiles"."id" = (select auth.uid())) WITH CHECK ("profiles"."id" = (select auth.uid()));--> statement-breakpoint
ALTER POLICY "profiles_delete_own" ON "profiles" TO authenticated USING ("profiles"."id" = (select auth.uid()));