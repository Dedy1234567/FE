import { useEffect, useState, Suspense, lazy } from "react";
import {
  CalendarDays, Search, RefreshCw, CheckCircle2,
  XCircle, Clock, Hotel, BedDouble,
  Circle,
} from "lucide-react";
import {
  getAllHotelBookings,
  cancelHotelBooking,
  completeHotelBooking,
} from "../../services/hotelBookingService";

// ─── Lazy ─────────────────────────────────────────────────────────────────────
const ConfirmModal = lazy(() => Promise.resolve({ default: _ConfirmModal }));

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  confirmed:  { label: "Confirmed",  bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-400" },
  pending:    { label: "Pending",    bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",   dot: "bg-amber-400"   },
  cancelled:  { label: "Cancelled", bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200",   dot: "bg-slate-400"   },
  checked_in: { label: "Checked In",bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    dot: "bg-blue-400"    },
  completed:  { label: "Completed", bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200",  dot: "bg-violet-400"  },
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
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          <td className="px-5 py-4"><div className="h-4 w-10 bg-slate-200 rounded" /></td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
          </td>
          <td className="px-5 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
          <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
          <td className="px-5 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
          <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
          <td className="px-5 py-4"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
          <td className="px-5 py-4">
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-slate-200 rounded-lg" />
              <div className="h-7 w-16 bg-slate-200 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── _ConfirmModal ────────────────────────────────────────────────────────────
function _ConfirmModal({ modal, actionLoading, onConfirm, onClose }) {
  if (!modal) return null;
  const isCancel = modal.type === "cancel";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
        style={{ animation: "modal-pop 0.18s ease-out" }}>
        <div className={`mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-2xl ${isCancel ? "bg-rose-50 border border-rose-100" : "bg-emerald-50 border border-emerald-100"}`}>
          {isCancel
            ? <XCircle size={24} className="text-rose-500" />
            : <CheckCircle2 size={24} className="text-emerald-500" />}
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          {isCancel ? "Batalkan Booking?" : "Tandai Selesai?"}
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {isCancel
            ? "Status booking akan berubah menjadi cancelled."
            : "Status booking akan berubah menjadi completed."}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={actionLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm disabled:opacity-50">
            Batal
          </button>
          <button onClick={onConfirm} disabled={actionLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors text-sm inline-flex items-center justify-center gap-2 shadow-sm disabled:opacity-70
              ${isCancel ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"}`}
          >
            {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {isCancel ? "Ya, Batalkan" : "Ya, Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function AdminHotelBookings() {
  const [bookings,      setBookings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [modal,         setModal]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllHotelBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadBookings(); }, []);

  const handleAction = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      if (modal.type === "cancel") {
        await cancelHotelBooking(modal.id);
        showToast("Booking berhasil dibatalkan");
      } else {
        await completeHotelBooking(modal.id);
        showToast("Booking ditandai selesai");
      }
      setModal(null);
      loadBookings();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memproses aksi", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = bookings
    .filter((b) =>
      [b.fullname, b.email, b.hotel_name, b.room_name]
        .some((v) => v?.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((b) => statusFilter === "all" || b.status === statusFilter);

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const fmt = (d) => d
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
    : "—";

  return (
    <>
      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}
          style={{ animation: "toast-in 0.2s ease-out" }}>
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Confirm Modal */}
      {modal && (
        <Suspense fallback={null}>
          <ConfirmModal modal={modal} actionLoading={actionLoading} onConfirm={handleAction} onClose={() => setModal(null)} />
        </Suspense>
      )}

      <div className="p-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Booking Hotel</h1>
            <p className="text-sm text-slate-500 mt-0.5">Pantau dan kelola seluruh reservasi kamar hotel</p>
          </div>
          <button onClick={loadBookings} disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 text-sm font-medium transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total",     value: stats.total,     icon: BedDouble,     accent: "text-indigo-600",  bg: "bg-indigo-50",  key: "all"       },
            { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2,  accent: "text-emerald-600", bg: "bg-emerald-50", key: "confirmed" },
            { label: "Pending",   value: stats.pending,   icon: Clock,         accent: "text-amber-600",   bg: "bg-amber-50",   key: "pending"   },
            { label: "Completed", value: stats.completed, icon: Circle,        accent: "text-violet-600",  bg: "bg-violet-50",  key: "completed" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle,       accent: "text-rose-500",    bg: "bg-rose-50",    key: "cancelled" },
          ].map(({ label, value, icon: Icon, accent, bg, key }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`text-left bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 transition-all hover:shadow-md
                ${statusFilter === key ? "border-teal-300 ring-1 ring-teal-200" : "border-slate-100"}`}>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={17} className={accent} />
              </div>
              <div>
                <p className={`text-lg font-bold tabular-nums ${accent} leading-none`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-700 text-sm">Daftar Booking</h2>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} dari {bookings.length} data</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, hotel, kamar, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700 placeholder-slate-400 transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wide">
                  {["ID", "Tamu", "Hotel", "Kamar", "Check In", "Check Out", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <TableSkeleton />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Hotel size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Tidak ada booking ditemukan</p>
                        <p className="text-slate-400 text-xs">
                          {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data booking"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((b, idx) => (
                    <tr key={b.id}
                      className={`hover:bg-teal-50/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>

                      {/* ID */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-slate-400">#{String(b.id).padStart(4,"0")}</span>
                      </td>

                      {/* Tamu */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {b.fullname?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm leading-none">{b.fullname}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{b.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Hotel */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Hotel size={13} className="text-teal-400 shrink-0" />
                          <span className="text-slate-700 font-medium text-sm whitespace-nowrap">{b.hotel_name}</span>
                        </div>
                      </td>

                      {/* Kamar */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                          <BedDouble size={11} />
                          {b.room_name}
                        </span>
                      </td>

                      {/* Check In */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs whitespace-nowrap">
                          <CalendarDays size={12} className="text-slate-400" />
                          {fmt(b.check_in)}
                        </div>
                      </td>

                      {/* Check Out */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs whitespace-nowrap">
                          <CalendarDays size={12} className="text-slate-400" />
                          {fmt(b.check_out)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={b.status} />
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {(b.status === "confirmed" || b.status === "pending") && (
                            <button onClick={() => setModal({ type: "complete", id: b.id })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-xs font-semibold transition-colors whitespace-nowrap">
                              <CheckCircle2 size={11} /> Selesai
                            </button>
                          )}
                          {b.status !== "cancelled" && b.status !== "completed" && (
                            <button onClick={() => setModal({ type: "cancel", id: b.id })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 text-xs font-semibold transition-colors whitespace-nowrap">
                              <XCircle size={11} /> Cancel
                            </button>
                          )}
                          {(b.status === "cancelled" || b.status === "completed") && (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
              Menampilkan {filtered.length} dari {bookings.length} booking
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHotelBookings;