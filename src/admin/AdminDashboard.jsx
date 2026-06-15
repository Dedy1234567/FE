import { Suspense, lazy, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Hotel, DoorOpen, UtensilsCrossed, Armchair,
  CalendarCheck, CalendarClock, Users, BedDouble,
  XCircle, Circle, RefreshCw,
} from "lucide-react";
import { getDashboardStats } from "../services/dashboardService";

// ─── Stat config ──────────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { key: "totalHotels",             label: "Total Hotel",        icon: Hotel,         accent: "text-teal-600",    iconBg: "bg-teal-100"    },
  { key: "totalRooms",              label: "Total Kamar",        icon: BedDouble,     accent: "text-blue-600",    iconBg: "bg-blue-100"    },
  { key: "totalUsers",              label: "Total Pengguna",     icon: Users,         accent: "text-violet-600",  iconBg: "bg-violet-100"  },
  { key: "totalHotelBookings",      label: "Booking Hotel",      icon: CalendarCheck, accent: "text-amber-600",   iconBg: "bg-amber-100"   },
  { key: "totalRestaurantBookings", label: "Reservasi Restoran", icon: CalendarClock, accent: "text-rose-600",    iconBg: "bg-rose-100"    },
  { key: "activeBookings",          label: "Booking Aktif",      icon: CalendarCheck, accent: "text-emerald-600", iconBg: "bg-emerald-100" },
  { key: "cancelledBookings",       label: "Booking Dibatalkan", icon: XCircle,       accent: "text-red-500",     iconBg: "bg-red-100"     },
];

function formatDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date());
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-200" />
      <div className="h-6 w-14 bg-slate-200 rounded-md mt-1" />
      <div className="h-3 w-24 bg-slate-100 rounded" />
    </div>
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────
function DashboardContent() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Gagal memuat data. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchStats(); }, []);

  const bookingRate = stats?.totalHotelBookings > 0
    ? Math.round((stats.activeBookings    / stats.totalHotelBookings) * 100) : 0;
  const cancelRate  = stats?.totalHotelBookings > 0
    ? Math.round((stats.cancelledBookings / stats.totalHotelBookings) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{formatDate()} — Selamat datang kembali</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 text-xs text-slate-500 hover:text-teal-600 border border-slate-200 hover:border-teal-300 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <XCircle size={16} className="shrink-0" />
          <span className="flex-1 text-xs sm:text-sm">{error}</span>
          <button onClick={fetchStats} className="ml-auto text-xs underline whitespace-nowrap">Coba lagi</button>
        </div>
      )}

      {/* ── Stats Grid ──
           Mobile:  2 kolom
           Tablet:  3 kolom
           Desktop: 4 kolom (7 item → baris 4+3) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? [...Array(7)].map((_, i) => <StatSkeleton key={i} />)
          : STAT_CONFIG.map(({ key, label, icon: Icon, accent, iconBg }) => (
              <div key={key} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon size={16} className={accent} />
                </div>
                <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-slate-800 leading-none tabular-nums">
                  {stats?.[key] ?? "—"}
                </p>
                <p className="mt-1 sm:mt-1.5 text-xs text-slate-500 leading-tight">{label}</p>
              </div>
            ))}
      </div>

      {/* ── Summary Row ──
           Mobile:  1 kolom (stacked)
           Desktop: 3 kolom (2+1) ── */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Booking breakdown */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Ringkasan Booking Hotel</h2>
              <p className="text-xs text-slate-400 mt-0.5">Berdasarkan total {stats.totalHotelBookings} booking</p>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {[
                { label: "Booking Aktif", value: stats.activeBookings,    pct: bookingRate, color: "bg-emerald-500", dot: "fill-emerald-500 text-emerald-500" },
                { label: "Dibatalkan",    value: stats.cancelledBookings,  pct: cancelRate,  color: "bg-red-400",     dot: "fill-red-400 text-red-400"         },
              ].map(({ label, value, pct, color, dot }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Circle size={7} className={dot} />
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {value}
                      <span className="font-normal text-slate-400 ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}

              {/* Mini summary — 3 kolom selalu */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Total",     value: stats.totalHotelBookings, color: "text-slate-700"   },
                  { label: "Aktif",     value: stats.activeBookings,     color: "text-emerald-600" },
                  { label: "Batal",     value: stats.cancelledBookings,  color: "text-red-500"     },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-2.5 sm:p-3 text-center">
                    <p className={`text-base sm:text-lg font-semibold tabular-nums ${color}`}>{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property overview */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Properti &amp; Pengguna</h2>
              <p className="text-xs text-slate-400 mt-0.5">Keseluruhan data sistem</p>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {[
                { label: "Hotel terdaftar",    value: stats.totalHotels,             icon: Hotel,         color: "text-teal-600",   bg: "bg-teal-50"   },
                { label: "Kamar tersedia",     value: stats.totalRooms,              icon: BedDouble,     color: "text-blue-600",   bg: "bg-blue-50"   },
                { label: "Pengguna aktif",     value: stats.totalUsers,              icon: Users,         color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Reservasi restoran", value: stats.totalRestaurantBookings, icon: CalendarClock, color: "text-amber-600",  bg: "bg-amber-50"  },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={color} />
                  </div>
                  <p className="flex-1 text-xs text-slate-500 truncate">{label}</p>
                  <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Access ──
           Mobile:  3 kolom
           Tablet:  4 kolom
           Desktop: 6 kolom ── */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Akses Cepat</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { to: "/admin/hotels",              label: "Hotel",           icon: Hotel           },
            { to: "/admin/rooms",               label: "Kamar",           icon: DoorOpen        },
            { to: "/admin/restaurants",         label: "Restoran",        icon: UtensilsCrossed },
            { to: "/admin/restaurant-tables",   label: "Meja",            icon: Armchair        },
            { to: "/admin/hotel-bookings",      label: "Booking Hotel",   icon: CalendarCheck   },
            { to: "/admin/restaurant-bookings", label: "Reservasi",       icon: CalendarClock   },
          ].map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 hover:border-teal-400 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
                <Icon size={17} className="text-slate-500 group-hover:text-teal-600 transition-colors" />
              </div>
              <span className="text-xs font-medium text-slate-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Lazy wrapper ─────────────────────────────────────────────────────────────
const LazyDashboard = lazy(
  () => new Promise((resolve) =>
    setTimeout(() => resolve({ default: DashboardContent }), 500)
  )
);

function DashboardLoader() {
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
      <p className="text-xs text-slate-400 tracking-wide">Memuat dashboard…</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <>
      <style>{`
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
      <Suspense fallback={<DashboardLoader />}>
        <LazyDashboard />
      </Suspense>
    </>
  );
}

export default AdminDashboard;