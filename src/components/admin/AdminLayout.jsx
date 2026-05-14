import { useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import { getInitials } from "../../lib/utils";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session } = useAuth();
  const email = session?.user?.email || "";

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#E5E7EB] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] flex items-center justify-center text-[#111111]"
          >
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7280] hidden sm:block">{email}</span>
            <div className="w-8 h-8 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 flex items-center justify-center text-[#FF6B1A] text-xs font-bold">
              {getInitials(email) || "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
