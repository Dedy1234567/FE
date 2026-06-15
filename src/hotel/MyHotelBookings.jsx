import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble, Moon, CreditCard,
  XCircle, CheckCircle2, RefreshCw, Hotel,
  AlertCircle, Search, Star, ArrowRight,
  TrendingUp, Clock, Shield, ChevronRight, User
} from "lucide-react";
import { MdOutlineBedroomParent } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import { getMyHotelBookings, cancelHotelBooking } from "../services/bookingService";
import { getHotels } from "../services/hotelService";

// ─── Lazy components ──────────────────────────────────────────────────────────
const StatsRow      = lazy(() => Promise.resolve({ default: _StatsRow      }));
const BookingList   = lazy(() => Promise.resolve({ default: _BookingList   }));
const CancelModal   = lazy(() => Promise.resolve({ default: _CancelModal   }));
const HotelRecs     = lazy(() => Promise.resolve({ default: _HotelRecs     }));
const QuickActions  = lazy(() => Promise.resolve({ default: _QuickActions  }));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => d
  ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
  : "—";

const STATUS = {
  pending:   { label: "Menunggu Pembayaran", bg: "bg-amber-500/10", text: "text-amber-700", border: "border-amber-500/20", dot: "bg-amber-500" },
  confirmed: { label: "Pemesanan Aktif", bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  cancelled: { label: "Dibatalkan", bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  completed: { label: "Selesai Menginap", bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-500/20", dot: "bg-blue-500" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/2">
          <div className="h-4 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-3 bg-slate-100 rounded-md animate-pulse w-2/3" />
        </div>
        <div className="h-6 w-24 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-12 bg-slate-50/80 rounded-xl animate-pulse" />
    </div>
  );
}

function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shrink-0 w-60">
      <div className="h-36 bg-slate-100 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md animate-pulse w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// ─── _StatsRow ────────────────────────────────────────────────────────────────
function _StatsRow({ bookings }) {
  const total = bookings.length;
  const active = bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed").length;
  const spend = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_price || 0), 0);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-950/10">
      <div className="absolute right-0 top-0 w-40 h-40 bg-linear-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none" />
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <User size={20} className="text-slate-200" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Akun Premium</span>
            <p className="text-base font-black tracking-tight text-white mt-0.5">Ringkasan Loyalitas Anda</p>
          </div>
        </div>
        <div className="h-px md:h-10 w-full md:w-px bg-slate-800" />
        <div className="grid grid-cols-3 gap-6 md:gap-12 w-full md:w-auto">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pesanan</p>
            <p className="text-xl font-black text-white mt-0.5 tabular-nums">{total}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perjalanan Aktif</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5 tabular-nums">{active}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Akumulasi Transaksi</p>
            <p className="text-sm font-bold text-slate-200 mt-1.5 tabular-nums">
              Rp {spend > 1000000 ? `${(spend / 1000000).toFixed(1)}M` : spend.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── _QuickActions ────────────────────────────────────────────────────────────
function _QuickActions() {
  const actions = [
    { icon: Hotel, label: "Eksplor Hotel", to: "/hotels", color: "text-slate-900" },
    { icon: TrendingUp, label: "Klaim Promo", to: "/hotels", color: "text-rose-600" },
    { icon: Clock, label: "Pesan Ulang", to: "#", color: "text-slate-600" },
    { icon: Shield, label: "Pusat Bantuan", to: "/", color: "text-slate-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ icon: Icon, label, to, color }) => (
        <Link key={label} to={to}
          className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-xs transition-all group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <Icon size={15} className={color} />
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-tight">{label}</span>
          </div>
          <ChevronRight size={13} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ))}
    </div>
  );
}

// ─── _HotelRecs ───────────────────────────────────────────────────────────────
function _HotelRecs({ hotels }) {
  if (!hotels || hotels.length === 0) return null;
  const display = hotels.slice(0, 5);

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Rekomendasi Eksklusif Untuk Anda</h2>
          <p className="text-[11px] text-slate-400 font-medium">Berdasarkan preferensi akomodasi terpopuler</p>
        </div>
        <Link to="/hotels" className="text-xs font-bold text-slate-900 hover:text-rose-600 inline-flex items-center gap-1 transition-colors">
          Lihat Semua <ChevronRight size={13} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {display.map((hotel) => (
          <div key={hotel.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden shrink-0 w-60 snap-start group/card hover:border-slate-200 transition-all">
            <div className="relative h-36 bg-slate-100 overflow-hidden">
              <img
                src={hotel.image_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80`}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover/card:scale-102 transition-transform duration-500"
                onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80`; }}
              />
              <div className="absolute top-2.5 left-2.5 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                {hotel.city || "Indonesia"}
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="font-bold text-slate-800 text-xs tracking-tight line-clamp-1 mb-1">{hotel.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-black text-slate-700">{hotel.rating || "4.5"}</span>
              </div>
              <Link to={`/hotels/${hotel.id}`}
                className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-rose-600 text-white text-[11px] font-bold py-2 rounded-xl transition-all shadow-xs">
                Pesan Kamar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── _BookingList (Data Langsung Terbaca Dari Backend) ──────────────────────────
function _BookingList({ bookings, onCancel, search }) {
  const filtered = bookings.filter((b) =>
    b.hotel_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.room_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-slate-100 p-6">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
          <BedDouble size={22} className="text-slate-400" />
        </div>
        <p className="text-slate-800 font-bold text-sm">Data Manifes Booking Kosong</p>
        <p className="text-slate-400 text-xs font-medium max-w-xs mt-1 mb-4">
          {search ? `Tidak ada hasil pencarian yang cocok untuk "${search}"` : "Anda belum melakukan reservasi kamar hotel apa pun saat ini."}
        </p>
        {!search && (
          <Link to="/hotels" className="bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md">
            Mulai Cari Akomodasi
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((booking) => {
        const isCancelled = booking.status === "cancelled";
        return (
          <div key={booking.id}
            className={`bg-white rounded-2xl border transition-all ${isCancelled ? "border-slate-100/70 bg-slate-50/40 opacity-75" : "border-slate-100 hover:border-slate-200 shadow-xs"}`}>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-50">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Hotel size={18} className="text-slate-800" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight leading-none">{booking.hotel_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MdOutlineBedroomParent size={13} className="text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">{booking.room_name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wider">ID: #{booking.id}</span>
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 bg-slate-50/40 px-4 rounded-xl my-4 border border-slate-100/50">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Check-In</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">{fmt(booking.check_in)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Check-Out</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">{fmt(booking.check_out)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Durasi</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 inline-flex items-center gap-1">
                    <Moon size={11} className="text-slate-400" /> {booking.total_nights} Malam
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Dibayar</span>
                  <span className="text-xs font-black text-slate-900 block mt-1 tabular-nums">
                    Rp {Number(booking.total_price).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {!isCancelled && booking.status !== "completed" && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                    <CreditCard size={12} /> Pembayaran via Virtual Account
                  </span>
                  <button onClick={() => onCancel(booking.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
                    <XCircle size={13} /> Batalkan Reservasi
                  </button>
                </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 max-w-sm w-full text-center"
        style={{ animation: "modal-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-rose-50 border border-rose-100">
          <AlertCircle size={22} className="text-rose-600" />
        </div>
        <h3 className="text-base font-black text-slate-900 tracking-tight">Konfirmasi Pembatalan</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
          Tindakan ini akan membatalkan hak sewa kamar Anda secara permanen. Apakah Anda yakin?
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all">
            Kembali
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all shadow-md">
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function MyHotelBookings() {
  const [bookings,  setBookings]  = useState([]);
  const [hotels,    setHotels]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [cancelId,  setCancelId]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const [bookRes, hotelRes] = await Promise.all([
        getMyHotelBookings(),
        getHotels().catch(() => ({ data: [] })) // jika getHotels gagal, jangan hancurkan seluruh page
      ]);
      
      setBookings(bookRes?.data || []);
      setHotels(hotelRes?.data || []);
    } catch (err) {
      console.error("Gagal memuat manifes booking:", err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings(); 
  }, []);

  const confirmCancel = async () => {
    try {
      await cancelHotelBooking(cancelId);
      setCancelId(null);
      showToast("Booking berhasil dibatalkan");
      loadBookings();
    } catch (err) {
      setCancelId(null);
      showToast(err.response?.data?.message || "Gagal membatalkan booking", "error");
    }
  };

  return (
    <MainLayout>
      <style>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translate3d(0, 15px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {cancelId && (
        <Suspense fallback={null}>
          <CancelModal onConfirm={confirmCancel} onCancel={() => setCancelId(null)} />
        </Suspense>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white
          ${toast.type === "error" ? "bg-rose-600" : "bg-slate-900"}`}
          style={{ animation: "toast-in 0.25s cubic-bezier(0.215, 0.610, 0.355, 1)" }}>
          {toast.type === "error" ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Manajemen Reservasi</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Pantau status, jadwal check-in, dan logistik hotel Anda</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari pesanan hotel..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 placeholder-slate-400"
              />
            </div>
            <button onClick={loadBookings} disabled={loading}
              className="inline-flex items-center px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {!loading && bookings.length > 0 && (
          <Suspense fallback={<div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />}>
            <StatsRow bookings={bookings} />
          </Suspense>
        )}

        <Suspense fallback={<div className="h-12 bg-slate-50 rounded-xl animate-pulse" />}>
          <QuickActions />
        </Suspense>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <BookingList bookings={bookings} onCancel={setCancelId} search={search} />
          )}
        </div>

        {!loading && hotels.length > 0 && (
          <Suspense fallback={
            <div className="flex gap-4 overflow-hidden">
              {[...Array(3)].map((_, i) => <HotelCardSkeleton key={i} />)}
            </div>
          }>
            <HotelRecs hotels={hotels} />
          </Suspense>
        )}

        {!loading && (
          <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <p className="font-black text-base tracking-tight">Ingin Merencanakan Liburan Berikutnya?</p>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Dapatkan garansi harga kamar termurah melalui akun keanggotaan Anda.</p>
            </div>
            <Link to="/hotels"
              className="bg-white text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all inline-flex items-center gap-1 shadow-xs">
              Cari Destinasi Baru <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyHotelBookings;