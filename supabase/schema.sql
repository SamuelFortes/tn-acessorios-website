create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  subtitle text,
  tone text not null default 'rose',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  old_price numeric(10,2) check (old_price is null or old_price >= price),
  placeholder text not null,
  tags text[] not null default '{}',
  description text,
  options jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  customer_name text,
  customer_email text,
  customer_phone text,
  payment_status text,
  payment_reference text,
  payment_method text,
  subtotal numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  notes text,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  variant text,
  unit_price numeric(10,2) not null default 0,
  qty integer not null check (qty > 0),
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant all on public.orders to service_role;
grant all on public.order_items to service_role;
grant usage, select on all sequences in schema public to service_role;

insert into public.categories (id, name, subtitle, tone, sort_order) values
  ('joias', 'Joias', 'Brincos, colares, anéis', 'rose', 1),
  ('perfumes', 'Perfumes', 'Florais, doces e amadeirados', 'wine', 2),
  ('bolsas', 'Bolsas', 'Estruturadas e festivas', 'sand', 3),
  ('kits', 'Kits de presente', 'Prontos para presentear', 'blush', 4)
on conflict (id) do update set
  name = excluded.name,
  subtitle = excluded.subtitle,
  tone = excluded.tone,
  sort_order = excluded.sort_order;

insert into public.products
  (id, category_id, name, price, old_price, placeholder, tags, description, options, sort_order)
values
  ('j-01', 'joias', 'Brinco Pérola Cluster', 79.90, 99.90, 'earrings-pearl', array['Mais vendido'], 'Composição de mini pérolas em formato de cacho. Banho de ouro 18k antialérgico, fecho tarraxa de pressão.', '{"Cor":["Pérola branca","Pérola creme"]}'::jsonb, 1),
  ('j-02', 'joias', 'Colar Coração Dourado', 119.90, null, 'necklace-heart', array['Novidade'], 'Corrente fina 45 cm com pingente coração vazado. Banho de ouro 18k.', '{"Tamanho":["40 cm","45 cm","50 cm"]}'::jsonb, 2),
  ('j-03', 'joias', 'Brinco Argola Texturizada', 64.90, null, 'earrings-hoop', array[]::text[], 'Argola média 2,5 cm com textura martelada. Acabamento dourado fosco.', '{}'::jsonb, 3),
  ('j-04', 'joias', 'Anel Solitário Cravejado', 89.90, null, 'ring-solitaire', array[]::text[], 'Anel ajustável com zircônia central de 6 mm em garra. Banho de ouro 18k.', '{"Aro":["14","16","18","20"]}'::jsonb, 4),
  ('j-05', 'joias', 'Brinco Coração Pérola', 59.90, null, 'earrings-heart', array['Queridinho'], 'Pequeno coração vazado com pérola central. Ideal para uso diário.', '{}'::jsonb, 5),
  ('j-06', 'joias', 'Pulseira Elos Riviera', 99.90, null, 'bracelet-chain', array[]::text[], 'Pulseira com elos médios e cravejamento contínuo. Fecho mosquetão reforçado.', '{}'::jsonb, 6),
  ('p-01', 'perfumes', 'Egeo Choc Feminino', 159.90, null, 'perfume-red', array['O Boticário'], 'Floral gourmand. Notas de chocolate, jasmim e baunilha. Frasco 90 ml.', '{}'::jsonb, 7),
  ('p-02', 'perfumes', 'Lily Essence', 299.90, null, 'perfume-white', array['O Boticário','Mais vendido'], 'Eau de parfum floral elegante com notas de lírio, bergamota e almíscar. 75 ml.', '{}'::jsonb, 8),
  ('p-03', 'perfumes', 'Coffee Woman Seduction', 119.90, null, 'perfume-amber', array['O Boticário'], 'Oriental amadeirado, com café tostado, baunilha e patchouli. 100 ml.', '{}'::jsonb, 9),
  ('p-04', 'perfumes', 'Floratta Rose Garden', 99.90, null, 'perfume-rose', array[]::text[], 'Floral rosado, leve e juvenil. Eau de toilette 75 ml.', '{}'::jsonb, 10),
  ('b-01', 'bolsas', 'Bolsa Carmim Estruturada', 249.90, 289.90, 'bag-red', array['Editorial'], 'Bolsa transversal em couro sintético texturizado. Alça regulável colorida.', '{"Cor":["Carmim","Preto","Caramelo"]}'::jsonb, 11),
  ('b-02', 'bolsas', 'Mini Bolsa Camelo', 189.90, null, 'bag-tan', array[]::text[], 'Mini bolsa quadrada com fivela dourada. Espaço para celular e cartões.', '{}'::jsonb, 12),
  ('b-03', 'bolsas', 'Clutch Festa Acetinada', 169.90, null, 'bag-clutch', array[]::text[], 'Clutch envelope com acabamento acetinado e corrente removível.', '{"Cor":["Champagne","Bordô","Rosé"]}'::jsonb, 13),
  ('k-01', 'kits', 'Kit Mãe Querida', 219.90, null, 'kit-mae', array['Best-seller'], 'Caixa presenteável com hidratante corporal, mini perfume e cartão personalizado. Embalagem com laço.', '{}'::jsonb, 14),
  ('k-02', 'kits', 'Kit Aniversário Rosé', 179.90, null, 'kit-aniver', array[]::text[], 'Brinco pérola + colar coração + bombons artesanais em caixa branca com laço rosé.', '{}'::jsonb, 15),
  ('k-03', 'kits', 'Kit Surpresa Especial', 289.90, null, 'kit-especial', array['Personalizável'], 'Você escolhe 3 produtos: monte do seu jeito. Embalagem premium inclusa.', '{}'::jsonb, 16)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  price = excluded.price,
  old_price = excluded.old_price,
  placeholder = excluded.placeholder,
  tags = excluded.tags,
  description = excluded.description,
  options = excluded.options,
  sort_order = excluded.sort_order,
  is_active = true;
