-- Run once in the Supabase SQL editor (Project → SQL Editor → New query).
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  phone      text check (phone is null or char_length(phone) <= 40),
  message    text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

-- Lock the table down: only the server (service-role key) can read/write.
-- With RLS on and no policies, anon/authenticated browser clients get nothing.
alter table public.contact_messages enable row level security;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
