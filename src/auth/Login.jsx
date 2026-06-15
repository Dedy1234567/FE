import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Star } from "lucide-react";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response   = await login({ email, password });
      const loggedUser = response.data.user;
      setUser(loggedUser);
      const role = loggedUser.role?.toLowerCase();
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login gagal. Periksa kembali kredensial Anda.");
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
      {/* Dark overlay seluruh background */}
      <div className="absolute inset-0 bg-slate-900/70" />

      {/* ── KIRI: Deskripsi ── */}
      <div className="relative z-10 hidden lg:flex flex-1 flex-col justify-between p-12">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
            <span className="text-teal-300 text-base leading-none">✦</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">BookEasy</span>
        </div>

        {/* Konten tengah */}
        <div className="max-w-sm">
          <div className="flex gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-teal-400 text-teal-400" />
            ))}
          </div>

          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Nikmati tidur &amp;<br />
            makan Anda di<br />
            <span className="text-teal-300">pilihan hotel kami.</span>
          </h2>

          <p className="text-white/50 text-sm leading-relaxed">
            Temukan ratusan hotel &amp; restoran terbaik dengan harga terjangkau.
            Pesan dalam hitungan detik, nikmati pengalaman tak terlupakan.
          </p>

          {/* Stats kecil */}
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

        {/* Footer kiri */}
        <p className="text-white/20 text-xs">© 2025 BookEasy · All rights reserved</p>
      </div>

      {/* Garis pemisah vertikal tipis */}
      <div className="relative z-10 hidden lg:block w-px bg-white/10 my-12" />

      {/* ── KANAN: Form Login ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-8 py-12 lg:px-14">

        {/* Mobile brand */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-teal-400/20 border border-teal-400/30 flex items-center justify-center">
            <span className="text-teal-300 text-sm">✦</span>
          </div>
          <span className="text-white font-bold text-lg">BookEasy</span>
        </div>

        <div className="w-full max-w-sm">

          {/* Glassmorphism card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 shadow-2xl">

            {/* Heading */}
            <div className="mb-7">
              <p className="text-teal-300/70 text-xs tracking-[0.2em] uppercase font-medium mb-1.5">
                Selamat Datang Kembali
              </p>
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Masuk ke BookEasy
              </h1>
              <p className="text-white/35 text-sm mt-1">
                Lanjutkan reservasi hotel &amp; restoran Anda
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
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
                    className="
                      w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                      bg-white/8 border border-white/12
                      text-white placeholder-white/20
                      outline-none
                      focus:border-teal-400/50 focus:bg-white/12
                      transition-all duration-200
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/45 tracking-widest uppercase">
                    Password
                  </label>
                  <button type="button" className="text-xs text-teal-300/60 hover:text-teal-300 transition-colors">
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="
                      w-full pl-10 pr-10 py-2.5 text-sm rounded-xl
                      bg-white/8 border border-white/12
                      text-white placeholder-white/20
                      outline-none
                      focus:border-teal-400/50 focus:bg-white/12
                      transition-all duration-200
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2 mt-1
                  bg-teal-500/85 hover:bg-teal-500 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white text-sm font-semibold tracking-wide
                  py-2.5 rounded-xl
                  transition-all duration-200
                "
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Memproses...</>
                ) : (
                  <> Masuk <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <hr className="flex-1 border-white/10" />
              <span className="text-xs text-white/20">atau</span>
              <hr className="flex-1 border-white/10" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-white/30">
              Belum punya akun?{" "}
              <a href="/register" className="text-teal-300/80 hover:text-teal-300 font-semibold transition-colors">
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;