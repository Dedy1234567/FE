import { Suspense, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Hotel, DoorOpen, UtensilsCrossed,
  Armchair, CalendarCheck, CalendarClock, Search,
  LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navGroups = [
  {
    label: "Manajemen Properti",
    items: [
      { to: "/admin/hotels",            label: "Hotel",    icon: Hotel           },
      { to: "/admin/rooms",             label: "Kamar",    icon: DoorOpen        },
      { to: "/admin/restaurants",       label: "Restoran", icon: UtensilsCrossed },
      { to: "/admin/restaurant-tables", label: "Meja",     icon: Armchair        },
    ],
  },
  {
    label: "Reservasi",
    items: [
      { to: "/admin/hotel-bookings",      label: "Booking Hotel",      icon: CalendarCheck },
      { to: "/admin/restaurant-bookings", label: "Reservasi Restoran", icon: CalendarClock },
    ],
  },
];

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "backdrop-fade 0.18s ease-out" }}
        onClick={() => !loading && onCancel()}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "modal-pop 0.2s ease-out" }}
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 to-cyan-400" />

        <div className="p-7 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
            <LogOut size={26} className="text-teal-400" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Keluar dari Admin Panel?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-7">
            Sesi Anda akan berakhir. Pastikan semua perubahan sudah tersimpan sebelum keluar.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors disabled:opacity-70 inline-flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Keluar...
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  Ya, Keluar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PageLoader ───────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md shadow-teal-200">
        <Hotel size={18} className="text-white" />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-500"
            style={{ animation: "dot-bounce 0.9s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="text-xs text-slate-400 tracking-wide">Memuat halaman…</p>
    </div>
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({ onNavClick, onLogoutClick }) {
  const location = useLocation();

  const isActive = (to) =>
    to === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(to);

  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
          <Hotel size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">BookEasy</p>
          <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        <Link
          to="/admin"
          onClick={onNavClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${isActive("/admin")
              ? "bg-teal-500/10 text-teal-400"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </Link>

        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(to)
                      ? "bg-teal-500/10 text-teal-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout button → buka modal */}
      <div className="border-t border-slate-800 p-3 shrink-0">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors group"
        >
          <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
          Keluar
        </button>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onMenuClick }) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-56 md:w-64">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari booking, tamu, kamar..."
            className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 select-none">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="text-sm hidden sm:block">
          <p className="font-medium text-slate-700 leading-none">{user?.name || "Admin"}</p>
          <p className="text-slate-400 text-xs mt-0.5">Super Admin</p>
        </div>
      </div>
    </header>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────
function AdminLayout() {
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [showLogout,    setShowLogout]    = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  const openLogoutModal = () => {
    closeSidebar(); // tutup drawer mobile jika terbuka
    setShowLogout(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setShowLogout(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <style>{`
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes backdrop-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>

      {/* ── Logout Modal ── */}
      {showLogout && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => !logoutLoading && setShowLogout(false)}
          loading={logoutLoading}
        />
      )}

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-slate-900 flex-col z-30">
        <SidebarContent onNavClick={undefined} onLogoutClick={openLogoutModal} />
      </aside>

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          <aside
            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-50"
            style={{ animation: "slide-in 0.22s ease-out" }}
          >
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X size={16} />
            </button>
            <SidebarContent onNavClick={closeSidebar} onLogoutClick={openLogoutModal} />
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto min-w-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;