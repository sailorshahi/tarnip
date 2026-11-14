-- TARNIP schema. Run in Supabase SQL editor.
create table profiles(id uuid primary key references auth.users on delete cascade, email text, is_admin boolean default false);
create table site_settings(key text primary key, value text);
insert into site_settings values('mode','construction'),('message','TARNIP is being built. Custom IoT hardware and software, coming soon.');
create table categories(id serial primary key, name text not null, slug text unique not null, kind text check(kind in('hardware','software')) not null, sort int default 0);
create table products(id serial primary key, category_id int references categories, name text not null, slug text unique not null, summary text, page_html text, price numeric(10,2) default 0, kind text check(kind in('hardware','software')) not null, image_url text, access_url text, active boolean default true, created_at timestamptz default now());
create table orders(id serial primary key, user_id uuid references auth.users, status text default 'pending', total numeric(10,2), created_at timestamptz default now());
create table order_items(id serial primary key, order_id int references orders on delete cascade, product_id int references products, qty int default 1, price numeric(10,2));
create table entitlements(id serial primary key, user_id uuid references auth.users, product_id int references products, order_id int references orders, unique(user_id,product_id));
create function is_admin() returns boolean language sql security definer as $$ select coalesce((select is_admin from profiles where id=auth.uid()),false) $$;
create function handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into profiles(id,email) values(new.id,new.email); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();
alter table profiles enable row level security; alter table site_settings enable row level security; alter table categories enable row level security; alter table products enable row level security; alter table orders enable row level security; alter table order_items enable row level security; alter table entitlements enable row level security;
create policy p_self on profiles for select using(id=auth.uid() or is_admin());
create policy s_read on site_settings for select using(true);
create policy s_write on site_settings for all using(is_admin()) with check(is_admin());
create policy c_read on categories for select using(true);
create policy c_write on categories for all using(is_admin()) with check(is_admin());
create policy pr_read on products for select using(active or is_admin());
create policy pr_write on products for all using(is_admin()) with check(is_admin());
create policy o_own on orders for select using(user_id=auth.uid() or is_admin());
create policy o_ins on orders for insert with check(user_id=auth.uid());
create policy o_upd on orders for update using(is_admin());
create policy oi_own on order_items for select using(exists(select 1 from orders o where o.id=order_id and (o.user_id=auth.uid() or is_admin())));
create policy oi_ins on order_items for insert with check(exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
create policy e_own on entitlements for select using(user_id=auth.uid() or is_admin());
create policy e_write on entitlements for all using(is_admin()) with check(is_admin());
-- Sample categories and products
insert into categories(name,slug,kind) values('Drones','drones','hardware'),('Water Management','water-management','hardware'),('Authorisation & Attendance','attendance','hardware'),('Management Software','management-software','software'),('Utilities','utilities','software');
insert into products(category_id,name,slug,summary,price,kind) values
(1,'TARNIP Survey Drone','survey-drone','Custom-built survey drone with telemetry.',0,'hardware'),
(2,'AquaSense Home','aquasense-home','Tank level, pump control and leak alerts for homes.',0,'hardware'),
(3,'GateTag Attendance','gatetag','RFID and biometric attendance terminal.',0,'hardware'),
(4,'TARNIP Console (web)','console-web','Web dashboard to manage your devices.',0,'software');
-- After you sign up on the site, make yourself admin:
-- update profiles set is_admin=true where email='you@example.com';
