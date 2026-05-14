import { CATEGORIAS } from "../../lib/constants";

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          !selected
            ? "bg-[#FF6B1A] border-[#FF6B1A] text-white"
            : "border-[#E5E7EB] text-[#6B7280] hover:border-[#FF6B1A] hover:text-[#111111]"
        }`}
      >
        Todos
      </button>
      {CATEGORIAS.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selected === cat.value
              ? "bg-[#FF6B1A] border-[#FF6B1A] text-white"
              : "border-[#E5E7EB] text-[#6B7280] hover:border-[#FF6B1A] hover:text-[#111111]"
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
