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
    es_combo: false,
    destacado: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) setForm({
      ...product,
      precio: String(product.precio),
      stock: String(product.stock),
      es_combo: !!product.es_combo,
      destacado: !!product.destacado,
    });
  }, [product]);

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "es_combo" && value) next.categoria = "combos";
      if (field === "es_combo" && !value && prev.categoria === "combos") next.categoria = "proteinas";
      return next;
    });
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
      es_combo: form.es_combo,
      destacado: form.destacado,
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

  const inputCls = "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6B1A] transition-colors";

  function Toggle({ checked, onChange, label }) {
    return (
      <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3">
        <span className="text-sm text-[#111111]">{label}</span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#FF6B1A]" : "bg-[#D1D5DB]"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in shadow-xl">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111111]">{isEdit ? "Editar producto" : "Nuevo producto"}</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111111] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Imagen */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">Imagen</label>
            <div className="flex gap-3 items-start">
              <div className="w-20 h-20 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                {form.imagen_url ? (
                  <img src={form.imagen_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#D1D5DB]">📦</span>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer flex items-center gap-2 text-xs text-[#6B7280] border border-dashed border-[#E5E7EB] hover:border-[#FF6B1A] rounded-xl p-3 transition-colors">
                  <Upload size={14} />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  type="url"
                  placeholder="O pegá una URL"
                  value={form.imagen_url || ""}
                  onChange={(e) => set("imagen_url", e.target.value)}
                  className="mt-2 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6B1A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Combo switch */}
          <Toggle
            checked={form.es_combo}
            onChange={(v) => set("es_combo", v)}
            label="¿Es un combo/promo?"
          />

          {/* Nombre */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">Nombre *</label>
            <input type="text" required value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
              placeholder={form.es_combo ? "Ej: Combo Star Premium" : "Ej: Proteína Whey 1kg Star Nutrition"}
              className={inputCls} />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">Categoría *</label>
            <select
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
              disabled={form.es_combo}
              className={`${inputCls} ${form.es_combo ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#6B7280] mb-1.5 block">Precio (ARS) *</label>
              <input type="number" min="0" step="0.01" required value={form.precio}
                onChange={(e) => set("precio", e.target.value)} placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] mb-1.5 block">Stock *</label>
              <input type="number" min="0" required value={form.stock}
                onChange={(e) => set("stock", e.target.value)} placeholder="0" className={inputCls} />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1.5 block">Descripción</label>
            <textarea rows={3} value={form.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)}
              placeholder={form.es_combo ? "Describí qué incluye el combo (productos componentes)" : "Descripción del producto..."}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Switches */}
          <Toggle checked={form.activo} onChange={(v) => set("activo", v)} label="Visible en tienda" />
          <Toggle checked={form.destacado} onChange={(v) => set("destacado", v)} label="Destacar en home" />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#F5F5F5] hover:bg-[#E5E7EB] text-[#111111] font-medium py-2.5 rounded-xl transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={saving || uploading}
              className="flex-1 bg-[#FF6B1A] hover:bg-[#FF8540] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
