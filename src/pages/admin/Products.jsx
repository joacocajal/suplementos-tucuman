import { useState, useEffect, useRef } from "react";
import { Plus, Search, Pencil, Trash2, Check, X as XIcon, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import { useAdminStore } from "../../store/adminStore";
import { supabase } from "../../lib/supabase";
import { formatCurrency } from "../../lib/utils";
import { CATEGORIAS } from "../../lib/constants";

function InlineEdit({ value, type = "text", onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value));
  const inputRef = useRef();

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  function save() {
    onSave(val);
    setEditing(false);
  }

  if (!editing) {
    return (
      <span
        onDoubleClick={() => { setVal(String(value)); setEditing(true); }}
        className="cursor-pointer hover:text-[#FF6B1A] transition-colors"
        title="Doble click para editar"
      >
        {value}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type={type}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        className="w-24 bg-white border border-[#FF6B1A] rounded px-2 py-0.5 text-xs text-[#111111] focus:outline-none"
      />
      <button onClick={save} className="text-[#16A34A] hover:opacity-80"><Check size={14} /></button>
      <button onClick={() => setEditing(false)} className="text-red-500 hover:opacity-80"><XIcon size={14} /></button>
    </div>
  );
}

export default function Products() {
  const products = useAdminStore((s) => s.products);
  const productsLoaded = useAdminStore((s) => s.productsLoaded);
  const loadProducts = useAdminStore((s) => s.loadProducts);
  const patchProduct = useAdminStore((s) => s.patchProduct);
  const dropProduct = useAdminStore((s) => s.dropProduct);

  const [loading, setLoading] = useState(!productsLoaded);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadProducts().then(() => setLoading(false));
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function refreshProducts() {
    setLoading(true);
    await loadProducts(true);
    setLoading(false);
  }

  async function updateField(id, field, value) {
    const parsed = field === "precio" ? parseFloat(value) : field === "stock" ? parseInt(value, 10) : value;
    const { error } = await supabase.from("productos").update({ [field]: parsed }).eq("id", id);
    if (error) { showToast(`Error: ${error.message}`, "error"); return; }
    patchProduct(id, { [field]: parsed });
    showToast("Actualizado");
  }

  async function toggleActivo(id, current) {
    const { error } = await supabase.from("productos").update({ activo: !current }).eq("id", id);
    if (!error) patchProduct(id, { activo: !current });
  }

  async function toggleDestacado(id, current) {
    const { error } = await supabase.from("productos").update({ destacado: !current }).eq("id", id);
    if (!error) patchProduct(id, { destacado: !current });
  }

  async function deleteProduct(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("productos").delete().eq("id", id);
    dropProduct(id);
    showToast("Producto eliminado");
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.categoria === catFilter;
    const matchTipo = tipoFilter === "all" || (tipoFilter === "combo" ? p.es_combo : !p.es_combo);
    return matchSearch && matchCat && matchTipo;
  });

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-[#111111]">PRODUCTOS</h1>
          <button
            onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#FF6B1A] hover:bg-[#FF8540] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#FF6B1A] transition-colors"
          >
            <option value="all">Todos los tipos</option>
            <option value="producto">Solo productos</option>
            <option value="combo">Solo combos</option>
          </select>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#FF6B1A] transition-colors"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["", "Producto", "Tipo", "Categoría", "Precio", "Stock", "Dest.", "Activo", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB]/50">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-[#F0F0F0] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-[#6B7280]">
                      No hay productos
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const cat = CATEGORIAS.find((c) => c.value === p.categoria);
                    return (
                      <tr key={p.id} className="border-b border-[#E5E7EB]/50 hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] overflow-hidden border border-[#E5E7EB] flex items-center justify-center">
                            {p.imagen_url ? (
                              <img src={p.imagen_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{cat?.icon || "📦"}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#111111] max-w-[200px]">
                          <p className="truncate">{p.nombre}</p>
                        </td>
                        <td className="px-4 py-3">
                          {p.es_combo ? (
                            <span className="text-xs font-semibold bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                              COMBO
                            </span>
                          ) : (
                            <span className="text-xs font-semibold bg-[#F0F0F0] text-[#6B7280] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                              Producto
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full">
                            {cat?.label || p.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#111111] font-mono text-xs">
                          <InlineEdit
                            value={formatCurrency(p.precio)}
                            type="number"
                            onSave={(v) => updateField(p.id, "precio", v)}
                          />
                        </td>
                        <td className="px-4 py-3 text-[#111111] text-xs">
                          <InlineEdit
                            value={p.stock}
                            type="number"
                            onSave={(v) => updateField(p.id, "stock", v)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleDestacado(p.id, p.destacado)}
                            className={`transition-colors ${p.destacado ? "text-yellow-500 hover:text-yellow-400" : "text-[#D1D5DB] hover:text-yellow-400"}`}
                            title={p.destacado ? "Quitar de destacados" : "Destacar en home"}
                          >
                            <Star size={16} fill={p.destacado ? "currentColor" : "none"} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActivo(p.id, p.activo)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${p.activo ? "bg-[#FF6B1A]" : "bg-[#D1D5DB]"}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.activo ? "translate-x-5" : "translate-x-0.5"}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditProduct(p); setShowForm(true); }}
                              className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111111] flex items-center justify-center transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id, p.nombre)}
                              className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-red-50 text-[#6B7280] hover:text-red-600 flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-[#6B7280]">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} · Doble click en precio o stock para editar inline
        </p>
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSaved={() => { refreshProducts(); showToast(editProduct ? "Producto actualizado" : "Producto creado"); }}
        />
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in shadow-xl ${
          toast.type === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}
