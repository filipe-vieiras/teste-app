-- Drop existing policies if any
drop policy if exists "Users can view own canvas" on business_canvas;
drop policy if exists "Users can create own canvas" on business_canvas;
drop policy if exists "Users can update own canvas" on business_canvas;
drop policy if exists "Users can delete own canvas" on business_canvas;

-- Create new policies with proper permissions
create policy "Users can view own canvas"
on business_canvas for select
using (auth.uid() = user_id);

create policy "Users can create own canvas"
on business_canvas for insert
with check (auth.uid() = user_id);

create policy "Users can update own canvas"
on business_canvas for update
using (auth.uid() = user_id);

create policy "Users can delete own canvas"
on business_canvas for delete
using (auth.uid() = user_id);

-- Enable RLS if not already enabled
alter table business_canvas enable row level security;