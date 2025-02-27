create table if not exists business_canvas (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  user_id uuid references auth.users not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table business_canvas enable row level security;

-- Create policies
create policy "Users can create their own canvas"
  on business_canvas for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own canvas"
  on business_canvas for select
  using (auth.uid() = user_id);

create policy "Users can update their own canvas"
  on business_canvas for update
  using (auth.uid() = user_id);

-- Enable realtime
alter table business_canvas replica identity full;