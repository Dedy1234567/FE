import { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  TableProperties,
  Mail,
  User,
  Filter,
  X,
  TrendingUp,
} from "lucide-react";

import {
  getAllRestaurantBookings,
  cancelRestaurantBooking,
  completeRestaurantBooking,
} from "../../services/restaurantBookingService";

/* ── STATUS CONFIG (Lebih Vibran & Premium) ── */
const STATUS_CFG = {
  pending: {
    label: "Pending",
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20 backdrop-blur-md",
    dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  },
  completed: {
    label: "Selesai",
    cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 backdrop-blur-md",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
  },
  cancelled: {
    label: "Dibatalkan",
    cls: "bg-rose-500/10 text-rose-600 border-rose-500/20 backdrop-blur-md",
    dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? {
    label: status,
    cls: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    dot: "bg-slate-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── STAT CARD (Modern Gradient Glow) ── */
function StatCard({ icon: Icon, label, value, gradient, iconColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
      {/* Decorative background gradient glow on hover */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-linear-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-all duration-500 blur-xl`} />
      
      <div className={`p-3.5 rounded-xl bg-linear-to-br ${gradient} shadow-md`}>
        <Icon size={22} className={iconColor || "text-white"} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800 mt-0.5 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

/* ── FORMATTERS ── */
function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtTime(t) {
  if (!t) return "-";
  return t.slice(0, 5);
}

function AdminRestaurantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchUser, setSearchUser] = useState("");
  const [searchResto, setSearchResto] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sort states
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // Modal states
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllRestaurantBookings();
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();
  }, []);

  const handleAction = async () => {
    if (!modal) return;
    try {
      setActionLoading(true);
      if (modal.type === "cancel") {
        await cancelRestaurantBooking(modal.id);
        showToast("Reservasi berhasil dibatalkan", "success");
      } else {
        await completeRestaurantBooking(modal.id);
        showToast("Reservasi ditandai selesai", "success");
      }
      setModal(null);
      loadBookings();
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal memproses aksi", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  /* ── FILTER + SORT LOGIC ── */
  const filtered = bookings
    .filter((b) => {
      const matchUser =
        b.fullname?.toLowerCase().includes(searchUser.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchUser.toLowerCase());
      const matchResto = b.restaurant_name?.toLowerCase().includes(searchResto.toLowerCase());
      const matchDate = searchDate
        ? new Date(b.reservation_date).toISOString().slice(0, 10) === searchDate
        : true;
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchUser && matchResto && matchDate && matchStatus;
    })
    .sort((a, b) => {
      const v = (x) =>
        sortField === "id"
          ? Number(x[sortField])
          : (x[sortField] ?? "").toString().toLowerCase();
      return sortDir === "asc" ? (v(a) > v(b) ? 1 : -1) : v(a) < v(b) ? 1 : -1;
    });

  const pending = bookings.filter((b) => b.status === "pending").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp size={14} className="inline ml-1 text-indigo-600 font-bold" />
      ) : (
        <ChevronDown size={14} className="inline ml-1 text-indigo-600 font-bold" />
      )
    ) : (
      <ChevronDown size={14} className="inline ml-1 text-slate-300 opacity-50" />
    );

  const hasFilter = searchUser || searchResto || searchDate || statusFilter !== "all";

  return (
    // Diubah menjadi div biasa yang fleksibel agar menyatu sempurna dengan sidebar utama Anda
    <div className="w-full min-h-screen bg-slate-50/50 p-6 lg:p-8 font-sans text-slate-600 antialiased">
      
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-60 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-sm font-semibold text-white transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === "error" ? "bg-linear-to-r from-rose-500 to-red-600" : "bg-linear-to-r from-emerald-500 to-teal-600"
        }`}>
          {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner ${
              modal.type === "cancel" ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
            }`}>
              {modal.type === "cancel" ? <XCircle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">
              {modal.type === "cancel" ? "Batalkan Reservasi?" : "Tandai Selesai?"}
            </h3>
            <p className="text-sm text-slate-400 px-2 mb-6 leading-relaxed">
              {modal.type === "cancel"
                ? "Tindakan ini akan mengubah status reservasi ini menjadi dibatalkan secara permanen."
                : "Pastikan pelanggan telah selesai berkunjung untuk menandai reservasi ini selesai."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition active:scale-95"
              >
                Kembali
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg ${
                  modal.type === "cancel"
                    ? "bg-linear-to-r from-rose-500 to-red-600 shadow-rose-500/20 hover:opacity-95"
                    : "bg-linear-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:opacity-95"
                }`}
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                {modal.type === "cancel" ? "Ya, Batalkan" : "Ya, Selesai"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER SECTION ── */}
      <div className="relative mb-8 p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 mb-3 backdrop-blur-sm">
              <TrendingUp size={12} /> Admin Console
            </span>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Kelola Reservasi Restoran
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm mt-1 font-medium">
              Monitor, filter, dan perbarui semua status pesanan meja secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UtensilsCrossed} label="Total Reservasi" value={bookings.length} gradient="from-indigo-500 to-purple-600" />
        <StatCard icon={Clock} label="Pending" value={pending} gradient="from-amber-400 to-orange-500" />
        <StatCard icon={CheckCircle2} label="Selesai" value={completed} gradient="from-emerald-400 to-teal-500" />
        <StatCard icon={XCircle} label="Dibatalkan" value={cancelled} gradient="from-rose-400 to-red-500" />
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
          <Filter size={16} className="text-indigo-500" />
          <span className="text-sm font-bold text-slate-700">Filter Pencarian Modern</span>
          {hasFilter && (
            <button
              onClick={() => {
                setSearchUser("");
                setSearchResto("");
                setSearchDate("");
                setStatusFilter("all");
              }}
              className="ml-auto inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg transition"
            >
              <X size={12} /> Reset Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nama pengguna / email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400 font-medium transition-all"
            />
          </div>

          <div className="relative">
            <UtensilsCrossed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nama restoran..."
              value={searchResto}
              onChange={(e) => setSearchResto(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400 font-medium transition-all"
            />
          </div>

          <div className="relative">
            <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-600 font-medium transition-all"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-600 font-medium transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>")', backgroundPosition: 'right 12px center', backgroundSize: '14px', backgroundRepeat: 'no-repeat' }}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TABLE CONTAINER CARD ── */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-700 text-sm tracking-tight">Daftar Reservasi Aktif</h2>
          {!loading && (
            <span className="text-[11px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">
              {filtered.length} / {bookings.length} Data ditemukan
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-250">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 text-[10px]">
                {[
                  { label: "ID", field: "id" },
                  { label: "User / Pelanggan", field: "fullname" },
                  { label: "Restoran", field: "restaurant_name" },
                  { label: "Nomor Meja", field: "table_number" },
                  { label: "Tanggal Main", field: "reservation_date" },
                  { label: "Jam", field: "reservation_time" },
                  { label: "Jumlah Tamu", field: "guest_count" },
                  { label: "Status", field: "status" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-5 py-3.5 text-left cursor-pointer hover:text-indigo-600 transition select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {label} <SortIcon field={field} />
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left">Aksi Manajemen</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 size={32} className="animate-spin text-indigo-500" />
                      <span className="text-xs font-semibold tracking-wide">Sinkronisasi data database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-25">
                    <UtensilsCrossed size={42} className="mx-auto text-slate-200 mb-3 animate-pulse" />
                    <p className="text-slate-400 font-medium">Tidak ada reservasi yang sesuai dengan kriteria filter</p>
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line no-unused-vars
                filtered.map((booking, idx) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-indigo-50/20 transition-colors duration-150 group"
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">
                        #{booking.id}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-white text-xs font-black">
                            {booking.fullname?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs group-hover:text-indigo-600 transition-colors">
                            {booking.fullname}
                          </p>
                          <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5 font-medium">
                            <Mail size={10} /> {booking.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Restaurant */}
                    <td className="px-5 py-4">
                      <span className="text-slate-700 font-semibold">
                        {booking.restaurant_name}
                      </span>
                    </td>

                    {/* Meja */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
                        <TableProperties size={12} className="text-slate-400 shrink-0" />
                        <span>T-{booking.table_number}</span>
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="px-5 py-4">
                      <span className="text-slate-600 font-medium">{fmtDate(booking.reservation_date)}</span>
                    </td>

                    {/* Jam */}
                    <td className="px-5 py-4">
                      <span className="font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
                        {fmtTime(booking.reservation_time)}
                      </span>
                    </td>

                    {/* Tamu */}
                    <td className="px-5 py-4">
                      <span className="text-slate-600 font-medium">{booking.guest_count} Orang</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => setModal({ type: "complete", id: booking.id })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold shadow-md shadow-emerald-500/10 transition active:scale-95"
                            >
                              <CheckCircle2 size={12} />
                              Selesai
                            </button>
                            <button
                              onClick={() => setModal({ type: "cancel", id: booking.id })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 font-bold transition active:scale-95"
                            >
                              <XCircle size={12} />
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status !== "pending" && (
                          <span className="text-xs text-slate-300 select-none font-medium italic">Selesai diproses</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 text-[11px] font-bold text-slate-400">
            Menampilkan {filtered.length} data entri saat ini
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRestaurantBookings;