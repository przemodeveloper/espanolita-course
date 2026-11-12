-- Speed up course entitlement checks: requireCourseAccess looks up by user_id.
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases (user_id);
