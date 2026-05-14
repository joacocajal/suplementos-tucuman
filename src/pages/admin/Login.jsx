import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) navigate("/admin", { replace: true });
  }, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos");
    } else {
      navigate("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logosuplementostucuman.jpeg"
            alt="Suplementos Tucumán"
            className="h-16 w-auto mb-4"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="font-display text-3xl text-[#FAFAFA]">PANEL ADMIN</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Suplementos Tucumán</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161616] border border-[#262626] rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@suplementostuc.com"
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#A1A1AA] mb-1.5 block">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 pr-10 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#FF6B1A] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA]"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B1A] hover:bg-[#FF8540] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
