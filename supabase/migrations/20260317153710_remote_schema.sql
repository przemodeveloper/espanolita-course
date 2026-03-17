


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."answers_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_id" "uuid" NOT NULL,
    "answer_text" "text" NOT NULL,
    "normalized_text" "text",
    "regex_pattern" "text",
    "is_primary" boolean DEFAULT false,
    "order_index" integer DEFAULT 0
);


ALTER TABLE "public"."answers_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."options_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_id" "uuid" NOT NULL,
    "label" "text",
    "text" "text" NOT NULL,
    "is_correct" boolean DEFAULT false,
    "explanation" "text",
    "order_index" integer DEFAULT 0
);


ALTER TABLE "public"."options_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "stripe_session_id" "text" NOT NULL,
    "stripe_customer_id" "text",
    "price_id" "text" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid",
    "claimed_at" timestamp with time zone
);


ALTER TABLE "public"."purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."questions_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "task_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "order_index" integer NOT NULL,
    "prompt" "jsonb",
    "points" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "gap_index" integer,
    "correct_key" "text"
);


ALTER TABLE "public"."questions_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_answers_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "attempt_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "option_id" "uuid",
    "answer_text" "text",
    "is_correct" boolean,
    "points_awarded" integer DEFAULT 0,
    "answered_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."student_answers_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_attempts_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "task_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "score" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "ai_score" numeric,
    "answer_text" "text",
    "feedback" "text",
    "status" "text" DEFAULT 'submitted'::"text",
    "started_at" timestamp with time zone,
    "submitted_at" timestamp with time zone,
    "graded_at" timestamp with time zone,
    "metadata" "jsonb"
);


ALTER TABLE "public"."task_attempts_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_set_items_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "set_id" "uuid" NOT NULL,
    "task_id" "uuid" NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."task_set_items_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_sets_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "type" "text" DEFAULT 'exam'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."task_sets_v2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "instructions" "text",
    "type" "text" NOT NULL,
    "content" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tasks_v2" OWNER TO "postgres";


ALTER TABLE ONLY "public"."answers_v2"
    ADD CONSTRAINT "answers_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."options_v2"
    ADD CONSTRAINT "options_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_stripe_session_id_key" UNIQUE ("stripe_session_id");



ALTER TABLE ONLY "public"."questions_v2"
    ADD CONSTRAINT "questions_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions_v2"
    ADD CONSTRAINT "questions_v2_task_id_order_index_key" UNIQUE ("task_id", "order_index");



ALTER TABLE ONLY "public"."student_answers_v2"
    ADD CONSTRAINT "student_answers_v2_attempt_id_question_id_key" UNIQUE ("attempt_id", "question_id");



ALTER TABLE ONLY "public"."student_answers_v2"
    ADD CONSTRAINT "student_answers_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_attempts_v2"
    ADD CONSTRAINT "task_attempts_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_set_items_v2"
    ADD CONSTRAINT "task_set_items_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task_sets_v2"
    ADD CONSTRAINT "task_sets_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks_v2"
    ADD CONSTRAINT "tasks_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "unique_purchase_email" UNIQUE ("email");



ALTER TABLE ONLY "public"."task_set_items_v2"
    ADD CONSTRAINT "unique_set_task" UNIQUE ("set_id", "task_id");



CREATE INDEX "idx_answers_attempt" ON "public"."student_answers_v2" USING "btree" ("attempt_id");



CREATE INDEX "idx_answers_question" ON "public"."student_answers_v2" USING "btree" ("question_id");



CREATE INDEX "idx_answers_question_v2" ON "public"."answers_v2" USING "btree" ("question_id");



CREATE INDEX "idx_answers_user" ON "public"."student_answers_v2" USING "btree" ("user_id");



CREATE INDEX "idx_attempts_user_task_status" ON "public"."task_attempts_v2" USING "btree" ("user_id", "task_id", "status");



CREATE INDEX "idx_options_question" ON "public"."options_v2" USING "btree" ("question_id");



CREATE INDEX "idx_questions_task" ON "public"."questions_v2" USING "btree" ("task_id");



CREATE INDEX "idx_task_set_items_order" ON "public"."task_set_items_v2" USING "btree" ("set_id", "order_index");



CREATE INDEX "idx_task_set_items_set" ON "public"."task_set_items_v2" USING "btree" ("set_id");



CREATE INDEX "idx_task_set_items_task" ON "public"."task_set_items_v2" USING "btree" ("task_id");



CREATE INDEX "task_attempts_v2_user_task_idx" ON "public"."task_attempts_v2" USING "btree" ("user_id", "task_id");



CREATE INDEX "tasks_v2_type_idx" ON "public"."tasks_v2" USING "btree" ("type");



ALTER TABLE ONLY "public"."answers_v2"
    ADD CONSTRAINT "answers_v2_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_set_items_v2"
    ADD CONSTRAINT "fk_set" FOREIGN KEY ("set_id") REFERENCES "public"."task_sets_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_set_items_v2"
    ADD CONSTRAINT "fk_task" FOREIGN KEY ("task_id") REFERENCES "public"."tasks_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."options_v2"
    ADD CONSTRAINT "options_v2_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."questions_v2"
    ADD CONSTRAINT "questions_v2_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_answers_v2"
    ADD CONSTRAINT "student_answers_v2_attempt_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."task_attempts_v2"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_answers_v2"
    ADD CONSTRAINT "student_answers_v2_user_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."task_attempts_v2"
    ADD CONSTRAINT "task_attempts_v2_user_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "No direct access" ON "public"."purchases" USING (false);



ALTER TABLE "public"."answers_v2" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "authenticated can read tasks" ON "public"."tasks_v2" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."options_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."questions_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_answers_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_attempts_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_set_items_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_sets_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tasks_v2" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can manage own attempts" ON "public"."task_attempts_v2" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."answers_v2" TO "anon";
GRANT ALL ON TABLE "public"."answers_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."answers_v2" TO "service_role";



GRANT ALL ON TABLE "public"."options_v2" TO "anon";
GRANT ALL ON TABLE "public"."options_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."options_v2" TO "service_role";



GRANT ALL ON TABLE "public"."purchases" TO "anon";
GRANT ALL ON TABLE "public"."purchases" TO "authenticated";
GRANT ALL ON TABLE "public"."purchases" TO "service_role";



GRANT ALL ON TABLE "public"."questions_v2" TO "anon";
GRANT ALL ON TABLE "public"."questions_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."questions_v2" TO "service_role";



GRANT ALL ON TABLE "public"."student_answers_v2" TO "anon";
GRANT ALL ON TABLE "public"."student_answers_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."student_answers_v2" TO "service_role";



GRANT ALL ON TABLE "public"."task_attempts_v2" TO "anon";
GRANT ALL ON TABLE "public"."task_attempts_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."task_attempts_v2" TO "service_role";



GRANT ALL ON TABLE "public"."task_set_items_v2" TO "anon";
GRANT ALL ON TABLE "public"."task_set_items_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."task_set_items_v2" TO "service_role";



GRANT ALL ON TABLE "public"."task_sets_v2" TO "anon";
GRANT ALL ON TABLE "public"."task_sets_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."task_sets_v2" TO "service_role";



GRANT ALL ON TABLE "public"."tasks_v2" TO "anon";
GRANT ALL ON TABLE "public"."tasks_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks_v2" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































