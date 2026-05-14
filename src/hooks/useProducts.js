import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProducts({ categoria = null, search = "", soloActivos = true } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [categoria, search, soloActivos]);

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase.from("productos").select("*").order("created_at", { ascending: false });
      if (soloActivos) query = query.eq("activo", true);
      if (categoria) query = query.eq("categoria", categoria);
      if (search) query = query.ilike("nombre", `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const { data } = await supabase.from("productos").select("*").eq("id", id).single();
      setProduct(data);
      if (data?.categoria) {
        const { data: rel } = await supabase
          .from("productos")
          .select("*")
          .eq("categoria", data.categoria)
          .eq("activo", true)
          .neq("id", id)
          .limit(4);
        setRelated(rel || []);
      }
    } finally {
      setLoading(false);
    }
  }

  return { product, related, loading };
}
