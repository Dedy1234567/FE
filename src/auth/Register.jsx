import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Star, CheckCircle2 } from "lucide-react";

import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Menggunakan setter dari AuthContext

  const [fullname, setFullname] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false); // State success dideklarasikan kembali

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await register({ fullname, email, password });
      
      const loggedUser = response.data?.user;  
      const role = loggedUser?.role?.toLowerCase();

      if (loggedUser) {
        setUser(loggedUser); // Update state user global agar Navbar berubah
      }
  
      setSuccess(true);
  
      setTimeout(() => {
        navigate(role === "admin" ? "/admin" : "/");
      }, 1500);
  
    } catch (error) {
      alert(error.response?.data?.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/70" />

      {/* ── KIRI: Deskripsi ── */}
      <div className="relative z-10 hidden lg:flex flex-1 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
            <span className="text-teal-300 text-base leading-none">✦</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">BookEasy</span>
        </div>

        <div className="max-w-sm">
          <div className="flex gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-teal-400 text-teal-400" />
            ))}
          </div>

          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Bergabung &amp;<br />
            mulai perjalanan<br />
            <span className="text-teal-300">terbaik Anda.</span>
          </h2>

          <p className="text-white/50 text-sm leading-relaxed">
            Buat akun gratis dan akses ratusan hotel &amp; restoran pilihan.
            Pesan kapan saja, di mana saja dengan mudah.
          </p>

          <div className="flex gap-6 mt-8">
            <div>
              <p className="text-white text-xl font-bold">500+</p>
              <p className="text-white/40 text-xs mt-0.5">Hotel &amp; Resto</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-white text-xl font-bold">50K+</p>
              <p className="text-white/40 text-xs mt-0.5">Tamu Puas</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-white text-xl font-bold">4.9</p>
              <p className="text-white/40 text-xs mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        <p className="text-white/20 text-xs">© 2026 BookEasy · All rights reserved</p>
      </div>

      <div className="relative z-10 hidden lg:block w-px bg-white/10 my-12" />

      {/* ── KANAN: Form Register ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-8 py-12 lg:px-14">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
            <span className="text-teal-300 text-sm">✦</span>
          </div>
          <span className="text-white font-bold text-lg">BookEasy</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Overlay Animasi Sukses */}
            {success && (
              <div className="absolute inset-0 bg-slate-900/95 z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <CheckCircle2 size={48} className="text-teal-400 animate-bounce mb-3" />
                <h3 className="text-white text-xl font-bold tracking-tight">Registrasi Berhasil!</h3>
                <p className="text-white/50 text-sm mt-1">Menyiapkan halaman utama Anda...</p>
                <Loader2 size={20} className="animate-spin text-teal-400/60 mt-4" />
              </div>
            )}

            <div className="mb-7">
              <p className="text-teal-300/70 text-xs tracking-[0.2em] uppercase font-medium mb-1.5">
                Buat Akun Baru
              </p>
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Daftar ke BookEasy
              </h1>
              <p className="text-white/35 text-sm mt-1">
                Gratis selamanya · Tanpa biaya pendaftaran
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/45 mb-1.5 tracking-widest uppercase">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/20 outline-none focus:border-teal-400/50 focus:bg-white/12 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/45 mb-1.5 tracking-widest uppercase">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/20 outline-none focus:border-teal-400/50 focus:bg-white/12 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/45 mb-1.5 tracking-widest uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/20 outline-none focus:border-teal-400/50 focus:bg-white/12 transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors disabled:opacity-50"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 mt-1 bg-teal-500/85 hover:bg-teal-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide py-2.5 rounded-xl transition-all duration-200"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Memproses...</>
                ) : (
                  <>Buat Akun <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <hr className="flex-1 border-white/10" />
              <span className="text-xs text-white/20">atau</span>
              <hr className="flex-1 border-white/10" />
            </div>

            <p className="text-center text-sm text-white/30">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-teal-300/80 hover:text-teal-300 font-semibold transition-colors"
              >
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;