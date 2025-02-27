create table if not exists public.business_canvas (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  user_id uuid references auth.users not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.business_canvas enable row level security;

-- Create policy
create policy "Users can create their own canvas"
  on public.business_canvas
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);