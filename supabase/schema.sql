-- =====================================================
-- SUPLEMENTOS TUCUMÁN — Schema + Seed
-- Correr todo este SQL en el SQL Editor de Supabase
-- =====================================================

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLA: productos
-- =====================================================
create table if not exists productos (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  categoria text not null check (categoria in ('vitaminas','creatinas','geles','hidratacion','proteinas','recovery','shakes')),
  precio numeric(10,2) not null check (precio >= 0),
  stock integer not null default 0 check (stock >= 0),
  imagen_url text,
  descripcion text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_productos_categoria on productos(categoria);
create index if not exists idx_productos_activo on productos(activo);

-- Trigger para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_productos_updated_at on productos;
create trigger set_productos_updated_at
  before update on productos
  for each row execute function update_updated_at_column();

-- =====================================================
-- TABLA: pedidos
-- =====================================================
create table if not exists pedidos (
  id uuid primary key default uuid_generate_v4(),
  productos_json jsonb not null,
  total numeric(10,2) not null,
  cliente_nombre text,
  cliente_whatsapp text,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmado','cancelado')),
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pedidos_estado on pedidos(estado);
create index if not exists idx_pedidos_created_at on pedidos(created_at desc);

-- =====================================================
-- TABLA: movimientos_stock
-- =====================================================
create table if not exists movimientos_stock (
  id uuid primary key default uuid_generate_v4(),
  producto_id uuid not null references productos(id) on delete cascade,
  tipo text not null check (tipo in ('entrada','salida','ajuste')),
  cantidad integer not null,
  stock_anterior integer not null,
  stock_nuevo integer not null,
  motivo text,
  created_at timestamptz not null default now()
);

create index if not exists idx_movimientos_producto on movimientos_stock(producto_id);
create index if not exists idx_movimientos_created_at on movimientos_stock(created_at desc);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
alter table productos enable row level security;
alter table pedidos enable row level security;
alter table movimientos_stock enable row level security;

-- productos: lectura pública, escritura solo autenticados
drop policy if exists "productos_select_public" on productos;
create policy "productos_select_public" on productos for select using (true);

drop policy if exists "productos_insert_auth" on productos;
create policy "productos_insert_auth" on productos for insert with check (auth.role() = 'authenticated');

drop policy if exists "productos_update_auth" on productos;
create policy "productos_update_auth" on productos for update using (auth.role() = 'authenticated');

drop policy if exists "productos_delete_auth" on productos;
create policy "productos_delete_auth" on productos for delete using (auth.role() = 'authenticated');

-- pedidos: insert público (clientes pueden crear pedido), select/update solo autenticados
drop policy if exists "pedidos_insert_public" on pedidos;
create policy "pedidos_insert_public" on pedidos for insert with check (true);

drop policy if exists "pedidos_select_auth" on pedidos;
create policy "pedidos_select_auth" on pedidos for select using (auth.role() = 'authenticated');

drop policy if exists "pedidos_update_auth" on pedidos;
create policy "pedidos_update_auth" on pedidos for update using (auth.role() = 'authenticated');

-- movimientos_stock: todo solo autenticados
drop policy if exists "movimientos_all_auth" on movimientos_stock;
create policy "movimientos_all_auth" on movimientos_stock for all using (auth.role() = 'authenticated');

-- =====================================================
-- REALTIME (habilitar para productos)
-- =====================================================
alter publication supabase_realtime add table productos;

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Policies del bucket
drop policy if exists "productos_storage_select" on storage.objects;
create policy "productos_storage_select" on storage.objects for select using (bucket_id = 'productos');

drop policy if exists "productos_storage_insert_auth" on storage.objects;
create policy "productos_storage_insert_auth" on storage.objects for insert with check (bucket_id = 'productos' and auth.role() = 'authenticated');

drop policy if exists "productos_storage_update_auth" on storage.objects;
create policy "productos_storage_update_auth" on storage.objects for update using (bucket_id = 'productos' and auth.role() = 'authenticated');

drop policy if exists "productos_storage_delete_auth" on storage.objects;
create policy "productos_storage_delete_auth" on storage.objects for delete using (bucket_id = 'productos' and auth.role() = 'authenticated');

-- =====================================================
-- SEED: PRODUCTOS INICIALES (18 productos)
-- =====================================================
insert into productos (nombre, categoria, precio, stock, descripcion) values
-- Vitaminas
('Vitamina C x60 Star Nutrition', 'vitaminas', 7300.00, 10, 'Vitamina C en cápsulas, 60 unidades. Refuerza el sistema inmune.'),

-- Creatinas
('Cafeína x30 Star Nutrition', 'creatinas', 7300.00, 10, 'Cafeína anhidra en cápsulas, 30 unidades. Pre-entreno.'),
('Citrato de Magnesio x60 Star Nutrition', 'creatinas', 14000.00, 10, 'Citrato de magnesio en cápsulas, 60 unidades.'),
('Collagen Plus 360gr Star Nutrition', 'creatinas', 21000.00, 10, 'Colágeno hidrolizado en polvo, 360gr.'),
('Creatina Monohidrata Star Nutrition 300gr', 'creatinas', 23500.00, 10, 'Creatina monohidrato pura, 300gr. 60 servicios aprox.'),

-- Geles
('Gel Chitaka', 'geles', 3300.00, 20, 'Gel energético Chitaka, unidad.'),
('Gel Chitaka x12', 'geles', 36500.00, 5, 'Caja x12 de geles energéticos Chitaka.'),
('Gel Mervick C/cafeína', 'geles', 1400.00, 30, 'Gel energético Mervick con cafeína, unidad.'),
('Gel Mervick C/cafeína x12', 'geles', 14500.00, 5, 'Caja x12 de geles Mervick con cafeína.'),
('Gel Mervick S/cafeína', 'geles', 1400.00, 30, 'Gel energético Mervick sin cafeína, unidad.'),
('Gel Mervick S/cafeína x12', 'geles', 14000.00, 5, 'Caja x12 de geles Mervick sin cafeína.'),

-- Hidratación
('Hidromax 20 sobres', 'hidratacion', 15500.00, 10, 'Bebida hidratante en sobres, caja x20.'),
('Hydromax 600gr', 'hidratacion', 12500.00, 10, 'Bebida hidratante en polvo, 600gr.'),
('Hydroplus Endurance 700gr Star Nutrition', 'hidratacion', 17500.00, 10, 'Bebida de hidratación para endurance, 700gr.'),

-- Proteínas
('Proteína Whey Star Nutrition 2lb', 'proteinas', 48000.00, 10, 'Whey protein concentrado, 2lb (~907gr).'),

-- Recovery
('Recovery Drink 540gr', 'recovery', 19000.00, 10, 'Bebida de recuperación post-entreno, 540gr.'),
('Recovery Drink 10 sobres', 'recovery', 20000.00, 10, 'Bebida de recuperación en sobres, caja x10.'),

-- Shakes
('Shake Everlast', 'shakes', 15000.00, 10, 'Shake Everlast listo para tomar.');

-- =====================================================
-- FIN
-- =====================================================
-- Próximos pasos:
-- 1. Crear usuario admin desde Authentication > Users > Add user (email + password)
-- 2. URL y anon key ya están en .env.local del front
-- 3. Subir imágenes de productos desde el dashboard
