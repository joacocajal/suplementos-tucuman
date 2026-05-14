import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useRealtimeProducts(onUpdate) {
  useEffect(() => {
    const channel = supabase
      .channel("productos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
