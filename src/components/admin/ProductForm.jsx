import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { CATEGORIAS } from "../../lib/constants";

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    nombre: "",
    categoria: "proteinas",
    precio: "",
    stock: "",
    descripcion: "",
    activo: true,
    imagen_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) setForm({ ...product, precio: String(product.precio), stock: String(product.stock) });
  }, [product]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("productos").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("productos").getPublicUrl(path);
      set("imagen_url", data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
      descripcion: form.descripcion || null,
      activo: form.activo,
      imagen_url: form.imagen_url || null,
      updated_at: new Date().toISOString(),
    };
    let res;
    if (isEdit) {
      res = await supabase.from("productos").update(payload).eq("id", product.id);
    } else {
      res = await supabase.from("productos").insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
    } else {
      onSaved?.();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#262626] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-[#161616] flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h3 className="font-semibold text-[#FAFAFA]">{isEdit ? "Editar producto" : "Nuevo producto"}</h3>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Imagen */}
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Imagen</label>
            <div className="flex gap-3 items-start">
              <div className="w-20 h-20 rounded-xl bg-[#0A0A0A] border border-[#262626] overflow-hidden flex items-center justify-center flex-shrink-0">
                {form.imagen_url ? (
                  <img src={form.imagen_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#333]">📦</span>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer flex items-center gap-2 text-xs text-[#A1A1AA] border border-dashed border-[#262626] hover:border-[#FF6B1A] rounded-xl p-3 transition-colors">
                  <Upload size={14} />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  type="url"
                  placeholder="O pegá una URL"
                  value={form.imagen_url || ""}
                  onChange={(e) => set("imagen_url", e.target.value)}
                  className="mt-2 w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-xs text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Nombre *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej: Proteína Whey 1kg Star Nutrition"
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Categoría *</label>
            <select
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#FF6B1A] transition-colors"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#A1A1AA] mb-1.5 block">Precio (ARS) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.precio}
                onChange={(e) => set("precio", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA] mb-1.5 block">Stock *</label>
              <input
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Descripción</label>
            <textarea
              rows={3}
              value={form.descripcion || ""}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="Descripción del producto..."
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors resize-none"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3">
            <span className="text-sm text-[#FAFAFA]">Producto activo (visible en tienda)</span>
            <button
              type="button"
              onClick={() => set("activo", !form.activo)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.activo ? "bg-[#FF6B1A]" : "bg-[#262626]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.activo ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {error && (
            <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#262626] hover:bg-[#333] text-[#FAFAFA] font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-[#FF6B1A] hover:bg-[#FF8540] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
