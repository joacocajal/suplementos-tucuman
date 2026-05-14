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
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#262626] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-[#FAFAFA]"
          >
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A1A1AA] hidden sm:block">{email}</span>
            <div className="w-8 h-8 rounded-full bg-[#FF6B1A]/20 border border-[#FF6B1A]/30 flex items-center justify-center text-[#FF6B1A] text-xs font-bold">
              {getInitials(email)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
