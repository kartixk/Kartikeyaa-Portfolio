-- ⚠️  DESTRUCTIVE — permanently deletes every table, view and sequence in the `public` schema.
-- Run in the Supabase SQL Editor, one step at a time. Only touches `public`
-- (auth, storage and other Supabase system schemas are NOT affected).

-- STEP 1 — look first. Confirm this list is exactly what you want gone.
select table_name, table_type
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- STEP 2 — (optional) export anything you want to keep:
-- Table Editor → pick a table → Export to CSV, or take a backup under Database → Backups.

-- STEP 3 — drop everything in `public`. Uncomment the block below to run it.
-- do $$
-- declare r record;
-- begin
--   for r in (select tablename from pg_tables where schemaname = 'public') loop
--     execute format('drop table if exists public.%I cascade', r.tablename);
--   end loop;
--   for r in (select viewname from pg_views where schemaname = 'public') loop
--     execute format('drop view if exists public.%I cascade', r.viewname);
--   end loop;
-- end $$;

-- STEP 4 — now run supabase/schema.sql to create the fresh contact_messages table.
