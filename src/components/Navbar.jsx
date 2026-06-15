import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, LogOut, BedDouble, UtensilsCrossed,
  LayoutDashboard, ChevronDown, Sparkles, AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

const NAV_LINKS = [
  { label: "Home",        to: "/"            },
  { label: "Hotels",      to: "/hotels"      },
  { label: "Restaurants", to: "/restaurants" },
];

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropRef = useRef(null);

  /* scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close user dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Mencegah scroll body ketika modal terbuka */
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showLogoutModal]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setShowLogoutModal(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/85 backdrop-blur-xl shadow-2xl border-b border-white/10"
            : "bg-slate-900/40 backdrop-blur-xs border-b border-white/5"
        }`}
      >
        {/* Accent Top Line Glow */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-rose-500/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

          {/* ── Brand / Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
              <Sparkles size={16} className="text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tight">BookEasy</span>
              <span className="text-white/40 text-[9px] tracking-widest uppercase font-bold mt-0.5">
                Luxury Hub
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <div className="hidden md:flex items-center bg-slate-950/40 border border-white/5 rounded-2xl px-1.5 py-1.5 gap-1 backdrop-blur-md">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                  isActive(to)
                    ? "bg-white/10 text-white shadow-xs border border-white/10"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={`flex items-center gap-3 px-3.5 py-1.5 rounded-xl border transition-all duration-300 ${
                    dropOpen
                      ? "bg-white/10 border-orange-400/40"
                      : "bg-white/5 hover:bg-white/8 border-white/5"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-xs">
                    <span className="text-white text-xs font-black">
                      {user.fullname?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="text-white/90 text-xs font-bold tracking-tight">
                    Hi, {user.fullname?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-white/30 transition-transform duration-300 ${dropOpen ? "rotate-180 text-orange-400" : ""}`}
                  />
                </button>

                {/* Profile Dropdown Card */}
                {dropOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ animation: "drop-in 0.2s ease-out" }}>
                    
                    {/* User Info */}
                    <div className="px-4 py-4 bg-white/5 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                          <span className="text-white font-black text-sm">
                            {user.fullname?.[0]?.toUpperCase() ?? "U"}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-white text-xs font-black truncate">{user.fullname}</p>
                          <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest bg-orange-400/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/10">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-2 space-y-0.5">
                      {user.role === "ADMIN" && (
                        <Link to="/admin" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <LayoutDashboard size={14} className="text-violet-400" />
                          Dashboard Admin
                        </Link>
                      )}
                      <Link to="/my-hotel-bookings" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <BedDouble size={14} className="text-indigo-400" />
                        Hotel Saya
                      </Link>
                      <Link to="/my-restaurant-bookings" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <UtensilsCrossed size={14} className="text-emerald-400" />
                        Restoran Saya
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="p-2 border-t border-white/5 bg-slate-950/20">
                      <button
                        onClick={() => { setDropOpen(false); setShowLogoutModal(true); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={14} />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                  className="text-white/70 hover:text-white text-xs font-bold tracking-wide uppercase px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
                  Masuk
                </Link>
                <Link to="/register"
                  className="bg-linear-to-r from-orange-500 to-rose-500 text-white text-xs font-bold tracking-wide uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/15 transition-all">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger Toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/80 hover:text-white transition-all"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ── Mobile Drawer Panel ── */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-950/98 backdrop-blur-2xl border-t border-white/5 px-4 py-5 space-y-4"
            style={{ animation: "drop-in 0.2s ease-out" }}>
            
            <div className="space-y-1">
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive(to)
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}>
                  {label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-1">
              {user ? (
                <>
                  {/* Mobile Profile Card */}
                  <div className="flex items-center gap-3.5 px-4 py-3 bg-white/5 rounded-xl border border-white/5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                      <span className="text-white font-black text-sm">
                        {user.fullname?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-black">{user.fullname}</p>
                      <p className="text-orange-400/80 text-[10px] uppercase tracking-widest font-bold mt-0.5">{user.role}</p>
                    </div>
                  </div>

                  {user.role === "ADMIN" && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <LayoutDashboard size={14} className="text-violet-400" />
                      Dashboard Admin
                    </Link>
                  )}
                  <Link to="/my-hotel-bookings" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <BedDouble size={14} className="text-indigo-400" />
                    Hotel Saya
                  </Link>
                  <Link to="/my-restaurant-bookings" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <UtensilsCrossed size={14} className="text-emerald-400" />
                    Restoran Saya
                  </Link>
                  
                  <button
                    onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-400/80 hover:bg-rose-500/10 rounded-xl transition-all pt-4 border-t border-white/5 mt-2"
                  >
                    <LogOut size={14} />
                    Keluar Akun
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 border border-white/10 rounded-xl bg-white/5 transition-all">
                    Masuk
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-linear-to-r from-orange-500 to-rose-500 rounded-xl transition-all">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowLogoutModal(false)}
          />
          
          <div 
            className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 text-center overflow-hidden"
            style={{ animation: "modal-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-500/10 rounded-full blur-xl" />
            
            <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 relative z-10">
              <AlertTriangle size={22} className="text-orange-400" />
            </div>

            <h3 className="text-white font-black text-lg tracking-tight">Akhiri sesi Anda?</h3>
            <p className="text-white/50 text-xs mt-2 mb-6 leading-relaxed">
              Anda perlu memasukkan kredensial login kembali nanti untuk dapat mengatur manifestasi reservasi aktif Anda.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 text-xs font-bold bg-white/5 hover:bg-white/8 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/10"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes drop-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Spacer to prevent layout shifting */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;