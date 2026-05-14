-- Agregar columnas a productos
alter table productos add column if not exists es_combo boolean not null default false;
alter table productos add column if not exists destacado boolean not null default false;

-- Actualizar el CHECK constraint de categoría
alter table productos drop constraint if exists productos_categoria_check;
alter table productos add constraint productos_categoria_check
  check (categoria in ('vitaminas','creatinas','geles','hidratacion','proteinas','recovery','shakes','combos'));

-- Seed de los 5 combos
insert into productos (nombre, categoria, precio, stock, descripcion, es_combo, destacado, activo) values
('Combo Star', 'combos', 69000.00, 10,
 'Proteína Whey Star Nutrition 2lb + Creatina Monohidrata Star Nutrition 300gr. La combinación clásica para ganar masa muscular.',
 true, true, true),

('Combo Creatina x2', 'combos', 45000.00, 10,
 '2 unidades de Creatina Monohidrata Star Nutrition 300gr. Pack ahorro para los que entrenan duro.',
 true, true, true),

('Combo Star Premium', 'combos', 82500.00, 10,
 'Proteína Whey Star Nutrition 2lb + Creatina Monohidrata 300gr + Hydroplus Endurance 700gr. Pack completo para entreno y recuperación.',
 true, true, true),

('Combo Carrera', 'combos', 13500.00, 15,
 '2 Geles Mervick + 1 Gel Chitaka + Cafeína x30 Star Nutrition. El kit perfecto para correr.',
 true, true, true),

('Combo Geles Mervick x12 + Regalo', 'combos', 15500.00, 5,
 'Caja x12 de geles Mervick con un gel de regalo. Promoción especial.',
 true, false, true);
