import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed, CalendarDays, Clock, Users,
  XCircle, CheckCircle2, RefreshCw, Search,
  AlertCircle,
} from "lucide-react";
import { MdOutlineTableRestaurant, MdOutlineRestaurantMenu } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import {
  getMyRestaurantBookings,
  cancelRestaurantBooking,
} from "../services/restaurantBookingService";

// ─── Lazy components ──────────────────────────────────────────────────────────
const StatsRow    = lazy(() => Promise.resolve({ default: _StatsRow    }));
const BookingList = lazy(() => Promise.resolve({ default: _BookingList }));
const CancelModal = lazy(() => Promise.resolve({ default: _CancelModal }));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => d
  ? new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
  : "—";

const fmtTime = (t) => t
  ? t.slice(0, 5)   // "HH:MM"
  : "—";

const STATUS = {
  pending:   { label: "Menunggu",    bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",  dot: "bg-amber-400",   bar: "from-amber-400 to-yellow-400"   },
  confirmed: { label: "Dikonfirmasi",bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200",dot: "bg-emerald-400", bar: "from-emerald-400 to-teal-400"   },
  cancelled: { label: "Dibatalkan",  bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200",  dot: "bg-slate-400",   bar: "from-slate-200 to-slate-300"    },
  completed: { label: "Selesai",     bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",   dot: "bg-blue-400",    bar: "from-blue-400 to-indigo-400"    },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 bg-slate-200" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="h-8 w-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

// ─── _StatsRow ────────────────────────────────────────────────────────────────
function _StatsRow({ bookings }) {
  const total     = bookings.length;
  const active    = bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const upcoming  = bookings.filter((b) => {
    if (b.status === "cancelled") return false;
    return new Date(b.reservation_date) >= new Date();
  }).length;

  const stats = [
    { icon: MdOutlineRestaurantMenu, label: "Total Reservasi", value: total,    accent: "text-orange-600",  bg: "bg-orange-50"  },
    { icon: CheckCircle2,            label: "Aktif",           value: active,   accent: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: CalendarDays,            label: "Akan Datang",     value: upcoming, accent: "text-blue-600",    bg: "bg-blue-50"    },
    { icon: XCircle,                 label: "Dibatalkan",      value: cancelled,accent: "text-rose-500",    bg: "bg-rose-50"    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map(({ icon: Icon, label, value, accent, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={accent} />
          </div>
          <div>
            <p className="text-xs text-slate-400 leading-none mb-1">{label}</p>
            <p className={`text-lg font-bold tabular-nums ${accent} leading-none`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── _BookingList ─────────────────────────────────────────────────────────────
function _BookingList({ bookings, onCancel, search }) {
  const filtered = bookings.filter((b) =>
    b.restaurant_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <UtensilsCrossed size={28} className="text-slate-300" />
        </div>
        <p className="text-slate-600 font-semibold">
          {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada reservasi"}
        </p>
        <p className="text-slate-400 text-sm mt-1 mb-5">
          {!search && "Mulai temukan restoran favorit Anda"}
        </p>
        {!search && (
          <Link to="/restaurants"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            <UtensilsCrossed size={15} /> Cari Restoran
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((booking) => {
        const isCancelled = booking.status === "cancelled";
        const s = STATUS[booking.status] || STATUS.pending;
        const isUpcoming  = !isCancelled && new Date(booking.reservation_date) >= new Date();

        return (
          <div key={booking.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md
              ${isCancelled ? "border-slate-100 opacity-75" : "border-slate-100"}`}
          >
            {/* Top bar */}
            <div className={`h-1 w-full bg-linear-to-r ${s.bar}`} />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                    <UtensilsCrossed size={17} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base leading-tight">{booking.restaurant_name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MdOutlineTableRestaurant size={13} className="text-slate-400" />
                      <p className="text-xs text-slate-500">Meja {booking.table_number}</p>
                      {isUpcoming && (
                        <span className="text-xs bg-blue-50 text-blue-500 font-medium px-1.5 py-0.5 rounded-md border border-blue-100">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">#{booking.id}</span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  {
                    icon: CalendarDays,
                    label: "Tanggal",
                    value: fmtDate(booking.reservation_date),
                    color: "text-orange-600",
                    bg:    "bg-orange-50",
                  },
                  {
                    icon: Clock,
                    label: "Jam",
                    value: fmtTime(booking.reservation_time),
                    color: "text-violet-600",
                    bg:    "bg-violet-50",
                  },
                  {
                    icon: Users,
                    label: "Tamu",
                    value: `${booking.guest_count} orang`,
                    color: "text-teal-600",
                    bg:    "bg-teal-50",
                  },
                  {
                    icon: MdOutlineTableRestaurant,
                    label: "Meja",
                    value: `No. ${booking.table_number}`,
                    color: "text-slate-600",
                    bg:    "bg-slate-50",
                  },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className={color} />
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                    <p className={`text-xs font-semibold ${color} leading-tight`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Cancel button */}
              {!isCancelled && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 text-xs font-semibold transition-colors"
                >
                  <XCircle size={13} /> Batalkan Reservasi
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── _CancelModal ─────────────────────────────────────────────────────────────
function _CancelModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
        style={{ animation: "modal-pop 0.18s ease-out" }}>
        <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-2xl bg-rose-50 border border-rose-100">
          <AlertCircle size={24} className="text-rose-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Batalkan Reservasi?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Reservasi Anda akan dibatalkan. Tindakan ini tidak dapat diurungkan.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">
            Tidak
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors text-sm shadow-sm shadow-rose-200">
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MyRestaurantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [search,   setSearch]   = useState("");
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyRestaurantBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadBookings(); }, []);

  const confirmCancel = async () => {
    try {
      await cancelRestaurantBooking(cancelId);
      setCancelId(null);
      showToast("Reservasi berhasil dibatalkan");
      loadBookings();
    } catch (err) {
      setCancelId(null);
      showToast(err.response?.data?.message || "Gagal membatalkan reservasi", "error");
    }
  };

  return (
    <MainLayout>
      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Cancel Modal */}
      {cancelId && (
        <Suspense fallback={null}>
          <CancelModal onConfirm={confirmCancel} onCancel={() => setCancelId(null)} />
        </Suspense>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
            ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}
          style={{ animation: "toast-in 0.2s ease-out" }}
        >
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Reservasi Restoran Saya</h1>
            <p className="text-slate-500 text-sm mt-0.5">Riwayat & status pemesanan meja restoran</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari restoran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-slate-700 placeholder-slate-400 transition"
              />
            </div>
            <button
              onClick={loadBookings}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {!loading && bookings.length > 0 && (
          <Suspense fallback={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-white rounded-2xl border border-slate-100" />
              ))}
            </div>
          }>
            <StatsRow bookings={bookings} />
          </Suspense>
        )}

        {/* ── List ── */}
        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <BookingList
              bookings={bookings}
              onCancel={setCancelId}
              search={search}
            />
          )}
        </Suspense>

      </div>
    </MainLayout>
  );
}

export default MyRestaurantBookings;