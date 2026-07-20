-- Atomic view-count increment, callable by anyone (visitors trigger this
-- just by viewing a resource page), safe because it only ever adds 1.
create or replace function public.increment_resource_views(resource_id uuid)
returns void as $$
  update public.resources
  set view_count = view_count + 1
  where id = resource_id;
$$ language sql security definer;

grant execute on function public.increment_resource_views(uuid) to anon, authenticated;
