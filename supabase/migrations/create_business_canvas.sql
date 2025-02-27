-- Create the business_canvas table
create table if not exists public.business_canvas (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    user_id uuid references auth.users not null,
    data jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.business_canvas enable row level security;

-- Create access policies
create policy "Users can view own canvas"
    on public.business_canvas
    for select
    using (auth.uid() = user_id);

create policy "Users can create own canvas"
    on public.business_canvas
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update own canvas"
    on public.business_canvas
    for update
    using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table public.business_canvas;